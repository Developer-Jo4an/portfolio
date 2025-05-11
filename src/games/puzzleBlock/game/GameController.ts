import GameAreaController from "./controllers/GameAreaController.ts";
import GameSpawnAreaController from "./controllers/GameSpawnAreaController.ts";
import GameGeneralController from "./controllers/GameGeneralController.ts";
import GameBoostersController from "./controllers/GameBoostersController.ts";
import GameAnimatedScoreAwarder from "./controllers/GameAnimatedScoreAwarder.ts";
import {createUtils, utils} from "./helpers/GameUtils.ts";
import {createGameFactory} from "./helpers/GameFactory.ts";
import PixiController from "../../../utils/containers/PixiController.ts";
import {gameTimelineSpaceId} from "../../../constants/puzzleBlock.ts";

export const GAME_SIZE = {width: 720, height: 1280};

export default class GameController extends PixiController {

  static CONTROLLERS = [
    GameGeneralController,
    GameAreaController,
    GameSpawnAreaController,
    GameBoostersController,
    GameAnimatedScoreAwarder
  ];

  controllers = [];

  levelData = {value: null};

  activeBooster = {value: null};

  targetBounding = {bounding: null};

  constructor(data) {
    super(data);

    this.setTargetBounding = this.setTargetBounding.bind(this);

    this.update = this.update.bind(this);

    this.initialize();
  }

  initialize() {
    this.initEvents();
  }

  initEvents() {
    const {eventBus} = this;

    eventBus.addEventListener("targetBounding:change", this.setTargetBounding);
  }

  loadManifestSelect() {
    return !this.isLoadedManifest && super.loadManifestSelect().then(() => this.isLoadedManifest = true);
  }

  loadingSelect() {
    return !this.isLoaded && super.loadingSelect().then(() => this.isLoaded = true);
  }

  initializationControllersSelect() {
    const {eventBus, renderer, canvas, stage, storage, state, levelData, activeBooster, targetBounding} = this;

    const controllerData = {
      eventBus, renderer, canvas, stage, storage, state, levelData, activeBooster, targetBounding
    };

    stage.sortableChildren = true;

    createUtils(controllerData);
    createGameFactory(controllerData);

    if (this.controllers.length)
      this.controllers.forEach(controller => controller.init());
    else
      this.controllers = GameController.CONTROLLERS.map(ControllerCls => new ControllerCls(controllerData));
  }

  initializationSelect() {
    this.app.ticker.add(this.update);
    this.setPause(false);
  }

  playingSelect() {
    this.setPause(false);
  }

  pauseSelect() {
    this.setPause(true);
  }

  winSelect() {
    this.setPause(true);
  }

  loseSelect() {
    this.setPause(true);
  }

  setTargetBounding({bounding}) {
    this.targetBounding.bounding = bounding;
  }

  setPause(isPause) {
    this.app.ticker[isPause ? "stop" : "start"]();
    gsap.localTimeline[isPause ? "pause" : "play"](gameTimelineSpaceId);
  }

  setLevelData(level) {
    this.levelData.value = level;
  }

  update(deltaTime) {
    const milliseconds = deltaTime * (1000 / 60);
    this.controllers.forEach(controller => controller?.update?.(milliseconds, deltaTime));
  }

  onResize({width, height} = this._size) {
    super.onResize({width, height});
    this._size = {width, height};
    const scale = Math.min(width / GAME_SIZE.width, height / GAME_SIZE.height);
    this.stage.scale.set(scale);
    this.stage.position.set(
      (width - GAME_SIZE.width * scale) / 2,
      (height - GAME_SIZE.height * scale) / 2
    );
  }

  resetSelect() {
    this.app.ticker.remove(this.update);
    gsap.localTimeline.clear(gameTimelineSpaceId);
  }

  destroy() {
    utils.reset();
    this.resetSelect();
    this.controllers.forEach(controller => controller.destroy());
  }
}
