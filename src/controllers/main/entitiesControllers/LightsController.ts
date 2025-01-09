import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {MainFactory} from "../MainFactory.ts";

export class LightsController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  target: ReturnType<typeof MainFactory.getEntity>;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);

    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.target = MainFactory.getEntity("actor");
    directionalLight.target = this.target;
    directionalLight.position.set(3, 3, 3);
    this.scene.add(directionalLight);
  }

  update(deltaTime: number): void {
  }
}
