import {GAME_SIZE} from "../GameController.ts";
import {gameFactory} from "./GameFactory.ts";

export let utils;

export default class GameUtils {

  constructor(data) {
    if (utils)
      return utils;
    utils = this;

    this.stateChanged = this.stateChanged.bind(this);

    this.storage = data.storage;
    this.eventBus = data.eventBus;
    this.state = data.state;
    this.activeBooster = data.activeBooster;
    this.levelData = data.levelData;
    this.stage = data.stage;
    this.renderer = data.renderer;

    this.eventBus.addEventListener("state-adapter:state-changed", this.stateChanged);
  }

  stateChanged({data: {state}}) {
    this.state = state;
  }

  getCellSize() {
    const {levelData: {value: {grid}}, storage: {mainSceneSettings: {area: {marginSide}}}} = this;

    const maxRowLength = grid.reduce((acc, {cells}) => Math.max(cells.length, acc), 0);
    const maxValue = Math.max(maxRowLength, grid.length);

    return (Math.min(GAME_SIZE.width, GAME_SIZE.height * 0.7) - 2 * marginSide) / maxRowLength - maxValue;
  }

  isCellEmpty(cell) {
    return cell && !Boolean(cell.getEntity("square")) && !Boolean(cell.getEntity("crystal"));
  }

  getMaxGridStats() {
    const grid = this.cellsToGrid();

    return {rows: grid.length, columns: Math.max(...grid.map(({length}) => length))};
  }

  cellsToGrid() {
    const cells = gameFactory.getCollectionByType("cell");

    return cells.reduce((acc, cell) => {
      const {row, column} = cell.getPosById();
      if (!acc[row]) acc[row] = [];
      acc[row][column] = cell;
      return acc;
    }, []);
  }

  getCellByGlobalPosition({x, y}) {
    const cells = gameFactory.getCollectionByType("cell");

    return cells.filter(({view}) => {
      const {width, height, ...coordinates} = view.getBounds();
      const [minX, maxX] = [coordinates.x, coordinates.x + width];
      const [minY, maxY] = [coordinates.y, coordinates.y + height];
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });
  }

  normalize(shape) {
    const minX = Math.min(...shape.map(([x]) => x));
    const minY = Math.min(...shape.map(([, y]) => y));

    return {minX, minY, normalized: shape.map(([x, y]) => [x - minX, y - minY])};
  }

  normalizeShape(shape) {
    const {minX, minY} = this.normalize(shape);

    return shape
    .map(([x, y]) => [x - minX, y - minY])
    .sort(([a1, b1], [a2, b2]) => (a1 - a2) || (b1 - b2));
  }

  getUniqueShapes(rotations) {
    const seenShapes = new Set();

    const uniqueShapes = [];

    for (const rotation of rotations) {
      const norm = JSON.stringify(this.normalizeShape(rotation));

      if (!seenShapes.has(norm)) {
        seenShapes.add(norm);
        uniqueShapes.push(rotation);
      }
    }

    return uniqueShapes;
  }

  rotateShape(shape, times, clockwise = false) { // Один time равен 90 (минус 90-а) градусам
    let current = shape;

    for (let i = 0; i < times; i++) {
      current = current.map(([x, y]) => clockwise ? [-y, x] : [y, -x]);
      current = this.normalize(current).normalized;
    }

    return current;
  }

  checkColumnOrRow(side, reservedCells = []) {
    const cells = utils.cellsToGrid();

    const length = side === "row" ? cells.length : cells[0].length;

    const completed = [];

    for (let counter = 0; counter < length; counter++) {
      let isSideComplete = true;

      const subLength = side === "row" ? cells[counter].length : cells.length;

      for (let subCounter = 0; subCounter < subLength; subCounter++) {
        const [index, subIndex] = [side === "row" ? counter : subCounter, side === "row" ? subCounter : counter];

        const necessaryCell = cells[index][subIndex];

        if (reservedCells.includes(necessaryCell)) continue;

        if (!necessaryCell.getEntity("square") && !necessaryCell.getEntity("crystal")) {
          isSideComplete = false;
          break;
        }
      }

      if (isSideComplete)
        ({
          row() {
            completed.push(...(cells[counter].reduce((acc, cell) => [...acc, cell.id], [])));
          },
          column() {
            for (let row = 0; row < cells.length; row++) {
              const necessaryCell = cells[row][counter];
              completed.push(necessaryCell.id);
            }
          }
        })[side]();
    }

    return completed;
  }

  getUniqFromArrays(...arrays) {
    return [...new Set(arrays.flat(Infinity))];
  }

  checkOnAddPoints(reservedCells = []) {
    const fullRowsCellIds = this.checkColumnOrRow("row", reservedCells);
    const fullColumnsCellIds = this.checkColumnOrRow("column", reservedCells);

    const allUniqSquares = this.getUniqFromArrays(fullRowsCellIds, fullColumnsCellIds);

    const cells = gameFactory.getCollectionByType("cell");

    return cells.reduce((acc, cell) => {
      const square = cell.getEntity("square");

      if (allUniqSquares.includes(cell.id) && square)
        acc.push(square);

      return acc;
    }, []);
  }

  reset() {
  }
}


export const createUtils = data => new GameUtils(data);
