import Data from "./Data.ts";
import GameController from "./GameController.ts";
import {GamePixiWrapper} from "./GamePixiWrapper.ts";

export default class GameWrapper extends GamePixiWrapper {

  storage = new Data();

  static get instance() {
    if (!this._instance)
      this._instance = new GameWrapper();
    return this._instance;
  }

  static _instance = null;

  setLevelData(level) {
    this?.controller?.setLevelData(level);
  }

  destroy() {
    this.controller?.destroy?.();
  }

  initController() {
    const {eventBus, storage} = this;
    return new GameController({
      eventBus, storage, applicationSettings: {transparent: true, backgroundColor: "transparent"}
    });
  }
}
