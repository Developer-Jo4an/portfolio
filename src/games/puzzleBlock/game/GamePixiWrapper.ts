import BaseWrapper from "../../../utils/wrappers/BaseWrapper.ts";
import PixiController from "../../../utils/containers/PixiController.ts";
import GameState from "./decorators/GameState.ts";
import CanvasResize from "../../../utils/decorators/resize/CanvasResize.ts";

export class GamePixiWrapper extends BaseWrapper {

  decorators = [GameState, CanvasResize];

  initController() {
    const {eventBus, storage} = this;

    return new PixiController({eventBus, storage});
  }
}
