import BaseGameController from "./BaseGameController.ts";
import {utils} from "../helpers/GameUtils";
import {gameFactory} from "../helpers/GameFactory";
import {upperFirst} from "../../../../utils/text/format.ts";

export default class GameBoostersController extends BaseGameController {

  static interactionEvents = ["click", "tap"];

  constructor(data) {
    super(data);

    this.boosterChange = this.boosterChange.bind(this);
    this.throwBooster = this.throwBooster.bind(this);

    this.initEvents();
    this.initProperties();
    this.init();
  }

  init() {
  }

  initProperties() {
    this.createdBoosters = 0;
    this.clearBoosterLogic = null;
  }

  initEvents() {
    const {eventBus} = this;

    eventBus.addEventListener("booster:change", this.boosterChange);
  }

  toggleEventsToGridArea(action) {
    const gridArea = gameFactory.getItemById("gridArea", "gridArea");

    gridArea.view.interactive = ({on: true, off: false})[action];

    GameBoostersController.interactionEvents.forEach(event => gridArea.view[action](event, this.throwBooster));
  }

  boosterChange({booster}) {
    const action = booster !== "reset" ? "on" : "off";

    this.activeBooster.value = ({on: booster, off: null})[action];

    this.toggleEventsToGridArea("off");

    this.clearBoosterLogic?.();

    ({
      on: () => {
        const boostersLogicData = [
          {types: ["hammer", "laser"], callback: () => this.toggleEventsToGridArea("on")},
          {types: ["rotation"], callback: () => this.enableRotation()}
        ];

        const {callback} = boostersLogicData.find(({types}) => types.includes(this.activeBooster.value));

        callback();
      }
    })[action]?.();
  }

  throwBooster({data}) {
    const {activeBooster: {value: activeBooster}} = this;

    const {x, y} = data.global;

    const isDroppedBooster = this[`enable${upperFirst(activeBooster)}`]?.({x, y});

    if (isDroppedBooster)
      this.resetBooster();
  }

  resetBooster() {
    this.createdBoosters++;
    this.eventBus.dispatchEvent({type: "boosters:uninstalled"});
    this.boosterChange({booster: "reset"});
  }

  enableHammer({x, y}) {
    const {stage} = this;

    const [tappedCell] = utils.getCellByGlobalPosition({x, y});

    const side = x >= window?.innerWidth / 2 ? "left" : "right";

    const insideSquare = tappedCell?.getEntity?.("square");

    if (!tappedCell || !insideSquare) return;

    const {x: xLocal, y: yLocal} = stage.toLocal({x, y});

    const hammer = gameFactory.createItem("hammer", {id: `hammer:${this.createdBoosters}`});

    const {view: hammerView} = hammer;

    const {xScaleMultiplier, x: formattedX, y: formattedY} = ({
      right: {xScaleMultiplier: -1, x: xLocal + hammerView.width / 2, y: yLocal},
      left: {xScaleMultiplier: 1, x: xLocal - hammerView.width / 2, y: yLocal}
    })[side];

    hammerView.position.set(formattedX, formattedY);
    hammerView.scale.x = hammerView.scale.x * xScaleMultiplier;
    hammerView.alpha = 0;

    this.eventBus.dispatchEvent({type: "state:change", newState: "boosterEffect"});

    stage.addChild(hammer.view);

    const {kickPromise, endPromise} = hammer.kickAnimation(side);

    kickPromise.then(() => {
      this.eventBus.dispatchEvent({type: "score:animatedCalculate", squares: [insideSquare]});
    });

    endPromise.then(() => {
      hammer.destroy();
      this.eventBus.dispatchEvent({type: "state:change", newState: "playing"});
    });

    return true;
  }

  enableLaser({x, y}) {
    const [tappedCell] = utils.getCellByGlobalPosition({x, y});

    if (!tappedCell) return;

    const {row, column} = tappedCell.getPosById();

    const cells = gameFactory.getCollectionByType("cell");

    const underInfluenceSquares = cells.reduce((acc, cell) => {
      const cellPosition = cell.getPosById();

      const square = cell.getEntity("square");

      if ((cellPosition.row === row || cellPosition.column === column) && square)
        acc.push(square);

      return acc;
    }, []);

    if (!underInfluenceSquares?.length) return;

    this.eventBus.dispatchEvent({type: "state:change", newState: "boosterEffect"});

    this.eventBus.dispatchEvent({
      type: "score:animatedCalculate",
      squares: underInfluenceSquares,
      onComplete: () => this.eventBus.dispatchEvent({type: "state:change", newState: "playing"})
    });

    return true;
  }

  enableRotation() {
    const shapes = gameFactory.getCollectionByType("squaresGroupView");

    const self = this;

    const clearListeners = shapes.map(shape => {
      const {view} = shape;

      const intermediate = () => eventCallback(shape);

      GameBoostersController.interactionEvents.forEach(event => view.on(event, intermediate));

      return () => GameBoostersController.interactionEvents.forEach(event => view.off(event, intermediate));
    });

    this.clearBoosterLogic = () => {
      clearListeners.forEach(clear => clear());

      this.clearBoosterLogic = null;
    };

    async function eventCallback(shape) {
      self.clearBoosterLogic();

      self.eventBus.dispatchEvent({type: "state:change", newState: "boosterEffect"});

      self.resetBooster();

      await shape.rotationAnimation();

      self.eventBus.dispatchEvent({type: "state:change", newState: "playing"});
    }

    return true;
  }

  resetSelect() {
    this.activeBooster.value = null;
    this.eventBus.dispatchEvent({type: "boosters:uninstalled"});
    this.clearBoosterLogic?.();
    this.boosterChange({booster: "reset"});
    this.initProperties();
    this.init();
  }

  destroy() {
    this.activeBooster.value = null;
    this.eventBus.dispatchEvent({type: "boosters:uninstalled"});
    this.clearBoosterLogic?.();
    this.boosterChange({booster: "reset"});
    this.initProperties();
  }
}
