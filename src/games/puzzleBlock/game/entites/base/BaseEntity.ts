import {gameFactory} from "../../helpers/GameFactory.ts";

export default class BaseEntity {

  _view;

  _id;

  _type;

  isDestroyed = false;

  constructor(data, type) {
    this.stateChanged = this.stateChanged.bind(this);

    this.initBaseProperties(data);
    this.initBaseEvents();

    this.type = type;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get view() {
    return this._view;
  }

  set view(value) {
    this._view = value;
  }

  init(data) {

  }

  initBaseProperties({state, id, levelData, storage, stage, eventBus, name, activeBooster, targetBounding}) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.storage = storage;
    this.eventBus = eventBus;
    this.levelData = levelData;
    this.state = state;
    this.activeBooster = activeBooster;
    this.targetBounding = targetBounding;
  }

  initBaseEvents() {
    this.eventBus.addEventListener("state-adapter:state-changed", this.stateChanged);
  }

  stateChanged({data: {state}}) {
    this.state = state;

    if (!this.isDestroyed)
      this.onStateChanged(state);
  }

  onStateChanged(state) {

  }

  getPosById() {
    try {
      const [row, column] = this.id.split("-").map(Number);
      return {row, column};
    } catch {
      return null;
    }
  }

  reset(data) {
    this.initBaseProperties(data);
  }

  destroy() {
    if (this.type)
      gameFactory.clearItemByEntity(this.type, this);
    else
      throw Error("type is not defined");
  }
}
