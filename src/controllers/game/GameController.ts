import {BaseController} from "../BaseController.ts";
import {CameraController} from "./entitiesController/CameraController.tsx";
import {BaseEntityProps} from "../main/entitiesControllers/BaseEntityController.ts";
import {ActorController} from "./entitiesController/ActorController.tsx";
import {LightController} from "./entitiesController/LightController.tsx";

type ControllerType =
  typeof CameraController |
  typeof ActorController |
  typeof LightController

type ControllerInstanceType = InstanceType<ControllerType>;

export class GameController extends BaseController<ControllerInstanceType> {

  static preloadId: string = "game";

  static CONTROLLERS: ControllerType[] = [
    CameraController,
    ActorController,
    LightController
  ];

  frame: number;

  lastTime: number;

  constructor(container: HTMLDivElement) {
    super(container);

    this.update = this.update.bind(this);
  }

  init(): void {
    super.init();

    this.renderer.outputEncoding = THREE.sRGBEncoding;

    const {container, eventBus, canvas, renderer, camera, scene} = this;

    const props: BaseEntityProps = {container, eventBus, canvas, renderer, camera, scene};

    this.controllers = GameController.CONTROLLERS.map((ControllerClass: ControllerType): ControllerInstanceType => new ControllerClass(props));

    this.frame = requestAnimationFrame(this.update);
  }

  update(deltaTime: number) {
    if (!this.lastTime) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame(this.update);
      return;
    }

    const currentTime: number = performance.now();

    const ms: number = currentTime - this.lastTime;

    this.lastTime = currentTime;

    if (ms > BaseController.MAX_MS) {
      this.frame = requestAnimationFrame(this.update);
      return;
    }

    this.controllers.forEach((controller: ControllerInstanceType) => controller.update(ms));

    super.update(deltaTime);

    this.frame = requestAnimationFrame(this.update);
  }
}
