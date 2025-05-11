import BaseGameController from "./BaseGameController.ts";
import {gameFactory} from "../helpers/GameFactory.ts";
import {GAME_SIZE} from "../GameController.ts";
import {gameTimelineSpaceId} from "../../../../constants/puzzleBlock.ts";
import {shuffle} from "../../../../utils/random/shuffle.ts";

export default class GameAnimatedScoreAwarder extends BaseGameController {
  constructor(data) {
    super(data);

    this.animatedCalculate = this.animatedCalculate.bind(this);

    this.initEvents();
    this.init();
  }

  initEvents() {
    const {eventBus} = this;

    eventBus.addEventListener("score:animatedCalculate", this.animatedCalculate);
  }

  init() {
  }

  async checkClearGrid() {
    const {stage} = this;

    const squares = gameFactory.getCollectionByType("square");

    const isClearGrid = squares.every(({cell}) => !cell);

    if (isClearGrid) {
      const star = gameFactory.createItem("star");

      star.view.position.set(GAME_SIZE.width / 2, GAME_SIZE.height / 2);

      stage.addChild(star.view);

      await star.showAnimation();

      star.destroy();
    }
  }

  async animatedCalculate({onComplete, squares: squaresArray}) {
    const {levelData: {value: {grid}}} = this;

    squaresArray.forEach(square => square.willKilled = true);

    await Promise.all(shuffle([...squaresArray]).map((square, i) => {
      return new Promise(res => gsap.to({}, {
        delay: i * 0.05, onComplete() {
          this.delete(gameTimelineSpaceId);
          square.removeSomeEntity().then(res);
        }
      }).save(gameTimelineSpaceId));
    }));

    const crystals = gameFactory.getCollectionByType("crystal");

    if (!crystals?.length) {
      await this.checkClearGrid();
      onComplete?.();
      return;
    }

    const {array: crystalPromises, isMoved} = crystals.reduce((acc, crystal) => {
      const {row: cellRow, column: cellColumn} = crystal.cell.getPosById();
      const {row: crystalFutureRow, column: crystalFutureColumn} = crystal.calculateFuturePosition();

      const animationType = cellRow === grid.length - 1
        ? "hideAnimation"
        : cellRow !== crystalFutureRow ? "moveAnimation" : "none";

      acc.array.push(({
        hideAnimation: async () => {
          acc.isMoved = true;
          await crystal.hideAnimation();
          crystal.destroy();
        },
        moveAnimation: async () => {
          acc.isMoved = true;
          await crystal.moveAnimation({row: crystalFutureRow, column: crystalFutureColumn});
        },
        none: () => {
          return Promise.resolve();
        }
      })[animationType]?.());

      return acc;
    }, {array: [], isMoved: false});

    await Promise.all(crystalPromises);

    if (isMoved) {
      this.animatedCalculate({onComplete, squares: []});
      return;
    }

    await this.checkClearGrid();

    onComplete?.();
  }

  resetSelect() {
  }

  destroy() {
  }
}
