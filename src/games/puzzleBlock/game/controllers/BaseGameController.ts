export default class BaseGameController {
  constructor(data) {
    this.stateChanged = this.stateChanged.bind(this);

    this.storage = data.storage;
    this.stage = data.stage;
    this.canvas = data.canvas;
    this.renderer = data.renderer;
    this.eventBus = data.eventBus;
    this.state = data.state;
    this.levelData = data.levelData;
    this.activeBooster = data.activeBooster;
    this.targetBounding = data.targetBounding;

    this.eventBus.addEventListener("state-adapter:state-changed", this.stateChanged);
  }

  stateChanged({data: {state}}) {
    this.state = state;
    this.onStateChanged(state);
  }

  onStateChanged(state) {

  }

  init() {

  }

  update(milliseconds, deltaTime) {

  }

  destroy() {

  }
}
