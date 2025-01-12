import {BaseWrapper} from "../BaseWrapper.ts";
import {GameController} from "./GameController.ts";
import {WrapperId} from "../config.ts";

export default class GameWrapper extends BaseWrapper<typeof GameController> {

  static id: WrapperId = "game";

  constructor(container: HTMLDivElement) {
    super({container: container, Class: GameController});
  }
}
