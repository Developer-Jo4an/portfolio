import BaseGameController from "./BaseGameController.ts";
import {GAME_SIZE} from "../GameController.ts";
import {utils} from "../helpers/GameUtils.ts";
import {gameFactory} from "../helpers/GameFactory.ts";
import {shuffle} from "../../../../utils/random/shuffle.ts";

export default class GameSpawnAreaController extends BaseGameController {

  constructor(data) {
    super(data);

    this.stepped = this.stepped.bind(this);

    this.initEvents();
    this.initProperties();
    this.init();
  }

  initEvents() {
    const {eventBus} = this;

    eventBus.addEventListener("step:stepped", this.stepped);
  }

  init() {
    gameFactory.createItem("spawnArea", {id: "spawnArea"});
  }

  initProperties() {
    this.step = 0;
    this.currentCreatedShapes = 0;
    this.generateShapeOrder = 1;
  }

  initializationSelect() {
    this.reloadPossibleBlockCombinations();
  }

  async createSelect() {
    const necessarySquares = utils.checkOnAddPoints();

    return new Promise(res => this.eventBus.dispatchEvent({
      type: "score:animatedCalculate", squares: necessarySquares,
      onComplete: () => {
        this.staticGenerateSquaresGroupArray();
        res();
      }
    }));
  }

  staticGenerateSquaresGroupArray() {
    const {
      storage: {mainSceneSettings: {generator: {spawnCount}}},
      levelData: {value: {spawnOrder}},
      generateShapeOrder
    } = this;

    this.currentBlocksState = this.sortBlockStates(
      this.currentBlocksState.map(shape => ({
        ...shape,
        cooldown: !!shape.cooldown ? shape.cooldown - 1 : 0,
        heightened: shape.heightened ?? 0
      }))
    );

    let worthyIds = this.currentBlocksState.slice(0, spawnCount).map(({id}) => id);

    let copyBlockStates = JSON.parse(JSON.stringify(this.currentBlocksState));

    const cells = gameFactory.getCollectionByType("cell");

    const reservedCells = [];
    const reservedShapes = [];

    const wiredShapes = spawnOrder[generateShapeOrder] ?? [];

    const isNotAvailableCell = (cell, isFind) => reservedCells.includes(cell.id) || !utils.isCellEmpty(cell) || isFind;

    for (let i = 0; i < spawnCount; i++) {
      const sortedCopyBlockStates = this.sortBlockStates(copyBlockStates);

      const shuffledCells = shuffle([...cells]);

      let isFindShape = false;

      if (!wiredShapes[i] || wiredShapes[i] === "random") {
        sortedCopyBlockStates.forEach(shapeData => {
          if (isFindShape) return;

          shuffledCells.forEach(cell => {
            if (isNotAvailableCell(cell, isFindShape)) return;

            const {isAvailable, cellsIds} = this.availableCellForShapeData(shapeData.block, cell, reservedCells);

            if (isAvailable) {
              reservedCells.push(...cellsIds);
              reservedShapes.push(shapeData);
              isFindShape = true;
            }
          });
        });
      } else {
        const wiredShapeData = sortedCopyBlockStates.find(({id}) => id === `${wiredShapes[i]}:0`);

        reservedShapes.push(wiredShapeData);

        let isFindCells = false;

        shuffledCells.forEach(cell => {
          if (isNotAvailableCell(cell, isFindCells)) return;

          const {isAvailable, cellsIds} = this.availableCellForShapeData(wiredShapeData.block, cell, reservedCells);

          if (isAvailable) {
            reservedCells.push(...cellsIds);
            isFindCells = true;
          }
        });
      }

      reservedShapes.forEach(shapeData => {
        copyBlockStates = copyBlockStates.map(currentShape =>
          shapeData.id === currentShape.id
            ? {...currentShape, cooldown: currentShape.cooldownTurns, heightened: 0}
            : currentShape
        );
      });
    }

    const onlyShapes = reservedShapes.reduce((acc, {block, id}) => {
      worthyIds = worthyIds.filter(shapeId => id !== shapeId);
      acc.push({shape: block.map(([x, y]) => `${y}-${x}`), id});
      return acc;
    }, []);

    this.currentBlocksState = copyBlockStates.map(shapeData => ({
      ...shapeData, heightened: shapeData.heightened + worthyIds.includes(shapeData.id) ? shapeData.increment : 0
    }));

    this.createShapesGroupView(onlyShapes);
  }

  availableCellForShapeData(block, cell, reservedCells) {
    const grid = utils.cellsToGrid();

    const availableCellsIds = block.reduce((acc, [x, y]) => {
      const {row, column} = cell.getPosById();
      const [modifiedY, modifiedX] = [y + row, x + column];
      const necessaryCell = grid[modifiedY]?.[modifiedX];

      if (utils.isCellEmpty(necessaryCell) && !reservedCells.includes(necessaryCell?.id))
        acc.push(necessaryCell?.id);

      return acc;
    }, []);

    return {
      isAvailable: availableCellsIds.length === block.length,
      cellsIds: availableCellsIds
    };
  }

  sortBlockStates(copyBlockStates) {
    return copyBlockStates.sort((a, b) => {
      const {cooldown: cooldownA = 0, heightened: heightenedA = 0, dropChance: dropChanceA = 0} = a;
      const {cooldown: cooldownB = 0, heightened: heightenedB = 0, dropChance: dropChanceB = 0} = b;

      if (!cooldownA !== !cooldownB) return !cooldownB ? 1 : -1;

      return (heightenedB + dropChanceB) - (heightenedA + dropChanceA);
    });
  }

  reloadPossibleBlockCombinations() {
    const {levelData: {value: {blocksData}}} = this;

    const clonedBlocksData = JSON.parse(JSON.stringify(blocksData));

    const reloadedCombinations = clonedBlocksData.reduce((acc, blockData) => {
      const {id, block, dropChance, increment, cooldownTurns} = blockData;

      const allRotationShapes = [block, ...new Array(3).fill(0).map((_, i) => utils.rotateShape(block, ++i))];

      const uniqRotationShapes = utils
      .getUniqueShapes(allRotationShapes)
      .map((block, index) => ({block, id: `${id}:${index}`, dropChance, increment, cooldownTurns}));

      return [...acc, ...uniqRotationShapes];
    }, []);

    this.currentBlocksState = shuffle([...reloadedCombinations]);
  }

  createShapesGroupView(shapes) {
    shapes.forEach((shape, index) => {
      const id = `${this.step}:${index}`;
      gameFactory.createItem("squaresGroupView", {id, shape});
    });

    this.currentCreatedShapes = shapes.length;

    this.generateShapeOrder++;

    this.exposeSquaresGroupView();
  }

  getFigureSizeData() {
    const {
      storage: {mainSceneSettings: {spawnArea: {distanceBetweenArea}, area: {marginSide, marginTop, marginBottom}}},
      levelData: {value: {blocksData}},
      currentCreatedShapes
    } = this;

    const shapeGroups = gameFactory.getCollectionByType("squaresGroupView");
    const gridArea = gameFactory.getItemById("gridArea", "gridArea");

    const maxFigureSize = blocksData.reduce((acc, blockData) => {
      return Math.max(acc, Math.max(...blockData.block.flat(Number.MAX_VALUE)));
    }, Number.MIN_VALUE) + 1;

    const maxWidth = (() => {
      const freePlace = GAME_SIZE.width - (marginSide * 2) - ((shapeGroups.length - 1) * marginSide);
      return freePlace / currentCreatedShapes / maxFigureSize;
    })();

    const maxHeight = (() => {
      return GAME_SIZE.height - gridArea.view.height - distanceBetweenArea - marginTop - marginBottom;
    })();

    return {maxWidth, maxHeight, maxFigureSize};
  }

  getShapeScale() {
    const {maxWidth, maxHeight} = this.getFigureSizeData();

    return Math.min(maxWidth, maxHeight) / utils.getCellSize();
  }

  exposeShapes(shapeScale) {
    const {
      storage: {mainSceneSettings: {area: {marginSide}}},
      currentCreatedShapes
    } = this;

    const {maxFigureSize} = this.getFigureSizeData();

    const shapeGroups = gameFactory.getCollectionByType("squaresGroupView");

    const blockSize = (GAME_SIZE.width - (marginSide * 2) - ((shapeGroups.length - 1) * marginSide)) / currentCreatedShapes;

    shapeGroups.forEach((shapeGroup, index) => {
      const {view} = shapeGroup;

      shapeGroup.setSelectionScale(shapeScale);

      view.position.set(
        (blockSize * index) + (marginSide * index) + (blockSize / 2),
        (maxFigureSize * utils.getCellSize() * shapeScale) / 2
      );
    });
  }

  exposeSpawnArea() {
    const {spawnArea: {distanceBetweenArea}, area: {marginTop}} = this.storage.mainSceneSettings;

    const spawnGroupArea = gameFactory.getItemById("spawnArea", "spawnArea");
    const gridArea = gameFactory.getItemById("gridArea", "gridArea");

    const {view: spawnGroupView} = spawnGroupArea;

    const bounds = spawnGroupView.getBounds();

    spawnGroupView.pivot.set(spawnGroupView.width / 2 + bounds.x, 0);
    spawnGroupView.position.set(GAME_SIZE.width / 2, gridArea.view.height + distanceBetweenArea + marginTop);
  }

  exposeSquaresGroupView() {
    const spawnGroupArea = gameFactory.getItemById("spawnArea", "spawnArea");
    const shapeGroups = gameFactory.getCollectionByType("squaresGroupView");

    shapeGroups.forEach(({view}) => {
      view.alpha = 0;
      spawnGroupArea.addShape(view);
    });

    const shapeScale = this.getShapeScale();
    this.exposeShapes(shapeScale);
    this.exposeSpawnArea();

    const {view: spawnGroupView} = spawnGroupArea;

    this.stage.addChild(spawnGroupView);

    shapeGroups.map(shape => shape.showAnimation().then(() => shape.setInteractive(true)));
  }

  setInteractiveShapes(isInteractive) {
    const shapeGroups = gameFactory.getCollectionByType("squaresGroupView");
    shapeGroups.forEach(shape => shape.setInteractive(isInteractive));
  }

  async stepped() {
    const shapeGroups = gameFactory.getCollectionByType("squaresGroupView");

    this.setInteractiveShapes(false);

    this.step++;

    const necessarySquares = utils.checkOnAddPoints();

    await new Promise(res => this.eventBus.dispatchEvent({
      type: "score:animatedCalculate", squares: necessarySquares,
      onComplete: res
    }));

    let isLose = false;

    shapeGroups?.length && this.eventBus.dispatchEvent({
      type: "game:checkOnLose", afterCheck: lose => {
        isLose = lose;
      }
    });

    if (isLose)
      this.setInteractiveShapes(false);
    else
      shapeGroups.length
        ? this.setInteractiveShapes(true)
        : this.staticGenerateSquaresGroupArray();
  }

  update(deltaTime) {

  }

  resetSelect() {
    this.initProperties();
    this.init();
    const squaresArea = gameFactory.getItemById("spawnArea", "spawnArea");
    squaresArea.clear();
  }

  destroy() {
    this.initProperties();
    const squaresArea = gameFactory.getItemById("spawnArea", "spawnArea");
    squaresArea.clear();
  }
}
