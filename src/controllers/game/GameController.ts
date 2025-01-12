import {BaseController} from "../BaseController.ts";

export class GameController extends BaseController {

  static preloadId: string = "game";

  static CONTROLLERS: [] = [];

  frame: number;

  lastTime: number;

  constructor(container: HTMLDivElement) {
    super(container);

    this.update = this.update.bind(this);
  }

  async init(): Promise<void> {
    await super.init();

    this.frame = requestAnimationFrame(this.update);
  }

  update(deltaTime: number) {
    if (!this.lastTime)
      this.lastTime = performance.now();

    console.log(1);

    super.update(deltaTime);

    this.frame = requestAnimationFrame(this.update);
  }
}
