import {BaseController} from "../BaseController.ts";
import {ActorController} from "./entitiesControllers/ActorController.ts";
import {CameraController} from "./entitiesControllers/CameraController.ts";
import {BaseEntityProps} from "./entitiesControllers/BaseEntityController.ts";
import {AssetsManager} from "../AssetsManager.ts";

type ControllerType = ActorController | CameraController;

export class MainController extends BaseController {

  static CONTROLLERS: [typeof ActorController, typeof CameraController] = [
    ActorController,
    CameraController
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

    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 2);

    const background: THREE.Texture | undefined = AssetsManager.getEntityByName("background", "rgbe");

    if (background) {
      background.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = background;
      this.scene.environment = background;
    }

    this.scene.add(ambientLight);

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
