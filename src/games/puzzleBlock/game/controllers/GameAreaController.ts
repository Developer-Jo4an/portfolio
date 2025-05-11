import BaseGameController from "./BaseGameController.ts";
import {GAME_SIZE} from "../GameController.ts";
import {gameFactory} from "../helpers/GameFactory.ts";
import {utils} from "../helpers/GameUtils.ts";
import {formattedNames, gameTimelineSpaceId} from "../../../../constants/puzzleBlock.ts";
import {shuffle} from "../../../../utils/random/shuffle.ts";

export default class GameAreaController extends BaseGameController {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    gameFactory.createItem("gridArea", {id: "gridArea"});
  }

  initializationSelect() {
    this.initGrid();
  }

  showingSelect() {
    const cells = gameFactory.getCollectionByType("cell");
    const gridArea = gameFactory.getItemById("gridArea", "gridArea");

    const showingTimeline = gsap.timeline().save(gameTimelineSpaceId);

    shuffle([...cells]).forEach((cell, index) => {
      showingTimeline.to(cell.view.scale, {
        x: 1, y: 1, duration: 0.2, delay: 0.3 + index * 0.01
      }, 0);
    });

    const onComplete = async res => {
      await gridArea.showBackground();
      showingTimeline.delete(gameTimelineSpaceId);
      res();
    };

    return new Promise(res => showingTimeline.eventCallback("onComplete", () => onComplete(res)));
  }

  initGrid() {
    const {storage: {mainSceneSettings: {area}}, levelData: {value: {grid}}, stage} = this;

    const gridArea = gameFactory.getItemById("gridArea", "gridArea");

    grid.forEach(({cells}, row) => cells.forEach((cell, column) => {
      const cellItem = gameFactory.createItem("cell", {row, column});

      const size = utils.getCellSize();

      const [x, y] = [column, row].map(axes => (axes * size) + (size / 2));

      cellItem.view.position.set(x, y);

      gridArea.addCell(cellItem.view);

      this.setCellElement({row, column, cell: cellItem});
    }));

    const {view: gridView} = gridArea;

    gridView.position.set((GAME_SIZE.width - gridView.width) / 2, area.marginTop);

    gameFactory.getCollectionByType("cell").forEach(cell => cell.view.scale.set(0));

    stage.addChild(gridView);
  }

  setCellElement({row, column, cell}) {
    const {levelData: {value: {grid}}} = this;

    const cellSettings = grid[row].cells[column];

    if (!cellSettings)
      throw new Error("cellSettings don't exist");

    const {elements: square, specialElements: crystal, ...other} = cellSettings;

    const entityType = square ? "square" : crystal && "crystal";

    if (!entityType) return;

    const extraProps = ({
      square: () => Object.entries(other).reduce((acc, [key, value]) => {
        acc[`${formattedNames[key]}Name`] = value;
        return acc;
      }, {squareViewId: square}),
      crystal: () => ({})
    })[entityType]?.();

    const entity = gameFactory.createItem(entityType, {id: cell.id, ...extraProps});

    cell.addEntity(entityType, entity);
  }

  update(milliseconds, deltaTime) {
  }

  resetSelect() {
    const gridArea = gameFactory.getItemById("gridArea", "gridArea");
    gridArea.clear();
  }

  destroy() {
    this.resetSelect();
  }
}
