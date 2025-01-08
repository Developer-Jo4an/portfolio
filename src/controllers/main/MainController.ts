import {BaseController} from "../BaseController.ts";
import {ActorController} from "./entitiesControllers/ActorController.ts";
import {CameraController} from "./entitiesControllers/CameraController.ts";
import {BaseEntityProps} from "./entitiesControllers/BaseEntityController.ts";

type ControllerType = ActorController | CameraController;

export class MainController extends BaseController {

  static CONTROLLERS: [typeof ActorController, typeof CameraController] = [
    ActorController,
    CameraController
  ];

  frame: number;

  constructor(container: HTMLDivElement) {
    super(container);

    this.update = this.update.bind(this);
  }

  init(): void {
    super.init();

    const {container, canvas, renderer, camera, scene} = this;

    const props: BaseEntityProps = {container, canvas, renderer, camera, scene};

    this.controllers = MainController.CONTROLLERS.map(ControllerClass => new ControllerClass(props)); //TODO: РАЗОБРАТЬСЯ

    this.frame = requestAnimationFrame(this.update);
  }

  update(deltaTime: number): void {
    this.controllers.forEach((controller: ControllerType) => controller.update(deltaTime));

    super.update(deltaTime);

    this.frame = requestAnimationFrame(this.update);
  }
}
