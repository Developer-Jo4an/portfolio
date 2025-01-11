import {BaseController} from "../BaseController.ts";
import {ActorController} from "./entitiesControllers/ActorController.ts";
import {CameraController} from "./entitiesControllers/CameraController.ts";
import {BaseEntityProps} from "./entitiesControllers/BaseEntityController.ts";
import {LightController} from "./entitiesControllers/LightController.ts";
import {RoomController} from "./entitiesControllers/RoomController.ts";

type ControllerType = ActorController | CameraController;

export class MainController extends BaseController {

  static CONTROLLERS: [
    typeof ActorController,
    typeof CameraController,
    typeof LightController,
    typeof RoomController
  ] = [
    ActorController,
    CameraController,
    LightController,
    RoomController
  ];

  frame: number;

  lastTime: number;

  constructor(container: HTMLDivElement) {
    super(container);

    this.update = this.update.bind(this);
  }

  async init(): Promise<void> {
    await super.init();

    const {container, canvas, renderer, camera, scene} = this;

    const props: BaseEntityProps = {container, canvas, renderer, camera, scene};

    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controllers = MainController.CONTROLLERS.map(ControllerClass => new ControllerClass(props)); //TODO: РАЗОБРАТЬСЯ

    this.frame = requestAnimationFrame(this.update);
  }

  update(deltaTime: number): void {
    if (!this.lastTime)
      this.lastTime = performance.now();

    const currentTime: number = performance.now();

    const ms: number = Math.min(25, currentTime - this.lastTime);

    this.lastTime = currentTime;

    this.controllers.forEach((controller: ControllerType) => controller.update(ms));

    super.update(deltaTime);

    this.frame = requestAnimationFrame(this.update);
  }
}
