import {BaseWrapper} from "../BaseWrapper.ts";
import {MainController} from "./MainController.ts";

export class MainWrapper extends BaseWrapper<MainController> {
  constructor(container: HTMLDivElement) {
    super(container, new MainController(container));
  }
}
