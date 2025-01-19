import {BaseController} from "../BaseController.ts";
import {ActorController} from "./entitiesControllers/ActorController.ts";
import {CameraController} from "./entitiesControllers/CameraController.ts";
import {BaseEntityProps} from "./entitiesControllers/BaseEntityController.ts";
import {LightController} from "./entitiesControllers/LightController.ts";
import {RoomController} from "./entitiesControllers/RoomController.ts";

type ControllerType =
  typeof ActorController |
  typeof CameraController |
  typeof LightController |
  typeof RoomController;

type ControllerInstanceType = InstanceType<ControllerType>

export class MainController extends BaseController<ControllerInstanceType> {

  public static preloadId: string = "main";

  private static CONTROLLERS: ControllerType[] = [
    ActorController,
    CameraController,
    LightController,
    RoomController
  ];

  private frame: number;

  private lastTime: number;

  constructor(container: HTMLDivElement) {
    super(container);

    this.update = this.update.bind(this);
  }

  init(): void {
    super.init();

    this.renderer.outputEncoding = THREE.sRGBEncoding;

    const {container, eventBus, canvas, renderer, camera, scene} = this;

    const props: BaseEntityProps = {scene, renderer, camera, container, canvas, eventBus};

    this.controllers = MainController.CONTROLLERS.map((ControllerClass: ControllerType): ControllerInstanceType => new ControllerClass(props));

    this.frame = requestAnimationFrame(this.update);
  }

  update(deltaTime: number): void {
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

  reset(): void {
    cancelAnimationFrame(this.frame);

    this.controllers.forEach((controller: ControllerInstanceType) => controller.reset());

    super.reset();
  }
}
