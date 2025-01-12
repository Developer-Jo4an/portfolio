import {BaseWrapper} from "../BaseWrapper.ts";
import {MainController} from "./MainController.ts";
import {WrapperId} from "../config.ts";

export default class MainWrapper extends BaseWrapper<typeof MainController> {

  static id: WrapperId = "main";

  constructor(container: HTMLDivElement) {
    super({container: container, Class: MainController});
  }
}
