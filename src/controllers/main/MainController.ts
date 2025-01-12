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

export class MainController extends BaseController {

  public static preloadId: string = "main";

  readonly static MAX_MS: number = 35;

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

    const {container, eventBus, canvas, renderer, camera, scene} = this;

    renderer.outputEncoding = THREE.sRGBEncoding;

    const props: BaseEntityProps = {scene, renderer, camera, container, canvas, eventBus};

    this.controllers = MainController.CONTROLLERS.map((ControllerClass: ControllerType) => new ControllerClass(props)); //TODO: РАЗОБРАТЬСЯ

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

    if (ms > MainController.MAX_MS) {
      this.frame = requestAnimationFrame(this.update);
      return;
    }

    this.controllers.forEach((controller: ControllerType) => controller.update(ms));

    super.update(deltaTime);

    this.frame = requestAnimationFrame(this.update);
  }
}
