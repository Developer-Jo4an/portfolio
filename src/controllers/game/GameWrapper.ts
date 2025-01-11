import {BaseWrapper} from "../BaseWrapper.ts";
import {GameController} from "./GameController.ts";

export class GameWrapper extends BaseWrapper<GameController> {
  constructor(container: HTMLDivElement) {
    super(container, new GameController(container));
  }
}
