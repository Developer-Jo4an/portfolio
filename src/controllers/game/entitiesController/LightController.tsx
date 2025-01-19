import {BaseEntityController, BaseEntityProps} from "../../main/entitiesControllers/BaseEntityController.ts";
import {Constants} from "../../../constants/scene/constants.ts";

const constants: Constants = {
  ambient: {color: 0xffffff, intensity: 1}
};

export class LightController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    const {ambient} = constants;
    this.ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);
    this.scene.add(this.ambientLight);
  }

  update(deltaTime: number): void {

  }
}
