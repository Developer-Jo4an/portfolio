import BaseCellItem from "../BaseCellItem.ts";
import {utils} from "../../../helpers/GameUtils.ts";
import {gameTimelineSpaceId} from "../../../../../../constants/puzzleBlock.ts";

export default class Crystal extends BaseCellItem {
  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties() {
    this.cell = null;
  }

  init() {
    super.init("crystal");
  }

  calculateFuturePosition() {
    const {cell} = this;

    if (!cell)
      throw new Error("cell is not defined");

    const {row, column} = cell.getPosById();

    const grid = utils.cellsToGrid();

    for (let currentRow = row + 1; currentRow <= grid.length; currentRow++) {
      const cell = grid[currentRow]?.[column];

      if (!cell)
        return {row: currentRow - 1, column};

      const square = cell.getEntity("square");
      const crystal = cell.getEntity("crystal");

      if (crystal) {
        const {row, column} = crystal.calculateFuturePosition();
        return {row: row - 1, column};
      }

      if (square)
        return {row: currentRow - 1, column};
    }
  }

  moveAnimation({row, column}) {
    const {view, view: {position}, cell} = this;

    if (!cell)
      throw new Error("cell is not defined");

    const grid = utils.cellsToGrid();

    const necessaryCell = grid[row][column];

    const [xDiff, yDiff] = [necessaryCell.view.x - cell.view.x, necessaryCell.view.y - cell.view.y];

    if (!necessaryCell)
      throw new Error("You need a cell to move");

    const tween = gsap.to(view.position, {
      onStart: () => {
        const {row} = cell.getPosById();
        const {rows} = utils.getMaxGridStats();
        cell.view.zIndex = rows - row;
      },
      x: position.x + xDiff,
      y: position.y + yDiff,
      duration: 0.5,
      ease: "sine.in"
    }).save(gameTimelineSpaceId);

    const onComplete = res => {
      tween.delete(gameTimelineSpaceId);
      this.toNewCell(necessaryCell);
      cell.view.zIndex = 0;
      res();
    };

    return new Promise(res => tween.eventCallback("onComplete", () => onComplete(res)));
  }

  toNewCell(newCell) {
    const {cell} = this;
    cell.removeEntity("crystal");
    newCell.addEntity("crystal", this);
  }

  hideAnimation(extraProps = {}) {
    const {view} = this;

    const tween = gsap.to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut", ...extraProps}).save(gameTimelineSpaceId);

    return new Promise(res => tween.eventCallback("onComplete", () => {
      tween.delete(gameTimelineSpaceId);
      this.eventBus.dispatchEvent({type: "target:change", changesData: {[this.type]: 1}});
      res();
    }));
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    const destroyData = [
      {entity: "cell", entityCallback: "removeEntity", entityCallbackArgs: ["crystal"], remove: () => this.cell = null}
    ];

    destroyData.forEach(({entity, entityCallback, entityCallbackArgs, remove}) => {
      const entityInstance = this[entity];

      if (entityInstance) {
        entityInstance[entityCallback](...(entityCallbackArgs ?? []));
        remove?.();
      }
    });

    super.destroy();
  }
}
