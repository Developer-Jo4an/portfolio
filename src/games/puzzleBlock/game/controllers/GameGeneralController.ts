import BaseGameController from "./BaseGameController.ts";
import {gameFactory} from "../helpers/GameFactory.ts";
import {utils} from "../helpers/GameUtils.ts";
import {gameTimelineSpaceId, stateMachine} from "../../../../constants/puzzleBlock.ts";
import {minmax} from "../../../../utils/minmax/minmax.ts";

export default class GameGeneralController extends BaseGameController {

  constructor(data) {
    super(data);

    this.targetChange = this.targetChange.bind(this);
    this.checkOnLose = this.checkOnLose.bind(this);
    this.checkOnWin = this.checkOnWin.bind(this);
    this.additionallyChange = this.additionallyChange.bind(this);

    this.initEvents();
    this.initProperties();
    this.init();
  }

  initProperties() {
  }

  init() {
    const {target} = this.levelData.value;

    this.target = JSON.parse(JSON.stringify(target));

    this.additionallyElements = {};

    this.eventBus.dispatchEvent({
      type: "target:update", targetData: this.target
    });

    this.eventBus.dispatchEvent({
      type: "additionallyElements:update", additionallyElementsData: this.additionallyElements
    });
  }

  initEvents() {
    const {eventBus} = this;

    eventBus.addEventListener("target:change", this.targetChange);
    eventBus.addEventListener("additionallyChange:change", this.additionallyChange);
    eventBus.addEventListener("game:checkOnLose", this.checkOnLose);
    eventBus.addEventListener("game:checkOnWin", this.checkOnWin);
  }

  playingSelect() {
    this.eventBus.dispatchEvent({type: "game:checkOnWin"});
    this.eventBus.dispatchEvent({type: "game:checkOnLose"});
  }

  targetChange({changesData}) {
    if (this.isAllTargetsZero()) return;

    for (const key in changesData) {
      const subtractCount = changesData[key];

      if (!this.target.hasOwnProperty(key)) continue;

      this.target[key] = Math.max(0, this.target[key] - subtractCount);
    }

    this.eventBus.dispatchEvent({type: "target:update", targetData: {...this.target}});

    this.checkOnWin();
  }

  additionallyChange({changesData}) {
    const {storage: {mainSceneSettings: {additionallyElements}}} = this;

    for (const key in changesData) {
      if (!this.additionallyElements.hasOwnProperty(key))
        this.additionallyElements[key] = 0;

      const {min, max} = additionallyElements[key];

      const prevValue = this.additionallyElements[key];

      this.additionallyElements[key] = minmax(min, max, prevValue + changesData[key]);
    }

    this.eventBus.dispatchEvent({
      type: "additionallyElements:update", additionallyElementsData: {...this.additionallyElements}
    });
  }

  isAllTargetsZero() {
    return Object.values(this.target).every(value => !Boolean(value));
  }

  checkOnWin() {
    const {state} = this;

    if (!stateMachine[state].availableStates.includes("winning")) return;

    if (this.isAllTargetsZero())
      this.winning();
  }

  checkOnLose({afterCheck}) {
    const {state} = this;

    if (!stateMachine[state].availableStates.includes("losing")) return;

    const groups = gameFactory.getCollectionByType("squaresGroupView");

    const cells = gameFactory.getCollectionByType("cell");

    const groupShapes = groups.map(({squares, rotationTimes}) => {
      const shapeBuffer = squares.map(square => {
        const {row, column} = square.getPosById();
        return [column, row];
      });

      const rotatedBuffer = utils.rotateShape(shapeBuffer, rotationTimes, true);

      return rotatedBuffer.map(([x, y]) => ({row: y, column: x}));
    });

    const isLose = !groupShapes.some(shape => {
      return cells.some(cell => {
        const {row: cellRow, column: cellColumn} = cell.getPosById();

        const necessaryCells = shape.reduce((acc, {row, column}) => {
          const necessaryId = `${cellRow + row}-${cellColumn + column}`;
          return [...acc, cells.find(cell => cell.id === necessaryId)];
        }, []);

        return necessaryCells.every(cell => utils.isCellEmpty(cell));
      });
    });

    if (isLose)
      this.losing();

    afterCheck?.(isLose);
  }

  winning() {
    const tween = gsap.to({}, {
      duration: 1,
      onStart: () => {
        this.eventBus.dispatchEvent({type: "state:change", newState: "winning"});
      },
      onComplete: () => {
        tween.delete(gameTimelineSpaceId);
        this.win();
      }
    }).save(gameTimelineSpaceId);
  }

  losing() {
    const tween = gsap.to({}, {
      duration: 1,
      onStart: () => {
        this.eventBus.dispatchEvent({type: "state:change", newState: "losing"});
      },
      onComplete: () => {
        tween.delete(gameTimelineSpaceId);
        this.lose();
      }
    }).save(gameTimelineSpaceId);
  }

  win() {
    this.eventBus.dispatchEvent({type: "state:change", newState: "win"});
  }

  lose() {
    this.eventBus.dispatchEvent({type: "state:change", newState: "lose"});
  }

  destroyFactoryItems() {
    const allEntitiesTypes = ["cell", "square", "squaresGroupView", "hammer", "ice", "crystal", "lightning", "gem", "player"];

    allEntitiesTypes.forEach(type => {
      const itemsByType = gameFactory.getCollectionByType(type) ?? [];
      itemsByType.forEach(item => item.destroy());
    });
  }

  resetSelect() {
    this.initProperties();
    this.destroyFactoryItems();
    this.init();
  }

  destroy() {
    this.initProperties();
    this.destroyFactoryItems();
  }
}
