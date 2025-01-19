import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {Constants} from "../../../constants/scene/constants.ts";
import {utils} from "../../../constants/scene/utils.ts";

const constants: Constants = {
  ambient: {
    color: 0xffffff,
    intensity: 1
  },
  spotLight: {
    color: 0xffffff,
    intensity: 2,
    distance: 300,
    angle: Math.PI / 6,
    penumbra: 1,
    power: 8,
    decay: 0,
    transformation: {
      position: {x: 0, y: 80, z: 100}
    },
    target: {
      transformation: {position: {x: 6, y: 0, z: -6}}
    }
  }
};

export class LightController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;
  spotLight: THREE.SpotLight;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    const {ambient, spotLight} = constants;

    this.ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);
    this.scene.add(this.ambientLight);

    this.spotLight = new THREE.SpotLight(
      spotLight.color,
      spotLight.intensity,
      spotLight.distance,
      spotLight.angle,
      spotLight.penumbra,
      spotLight.decay
    );
    this.spotLight.castShadow = true;
    this.spotLight.power = spotLight.power;
    const target: THREE.Object3D = new THREE.Object3D();
    utils.setTransformation<THREE.Object3D>(spotLight.target.transformation, target);
    target.name = "spotLightTarget";
    this.spotLight.target = target;
    this.scene.add(this.spotLight.target);
    utils.setTransformation<THREE.SpotLight>(spotLight.transformation, this.spotLight);
    this.scene.add(this.spotLight);
  }

  update(deltaTime: number): void {
  }
}
