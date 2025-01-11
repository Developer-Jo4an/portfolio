import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";

const AmbLight = {
  color: 0xffffff,
  intensity: 1
};

const PointLightFirst = {
  position: {x: 0, y: 5, z: 3},
  color: 0xffffff,
  intensity: 16,
  distance: 10
};

const PointLightSecond = {
  position: {x: 0, y: 5, z: -3},
  color: 0xffffff,
  intensity: 16,
  distance: 10
};

export class LightController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;
  pointLightFirst: THREE.PointLight;
  pointLightSecond: THREE.PointLight;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.ambientLight = new THREE.AmbientLight(AmbLight.color, AmbLight.intensity);
    this.scene.add(this.ambientLight);

    this.pointLightFirst = new THREE.PointLight(PointLightFirst.color, PointLightFirst.intensity, PointLightFirst.distance);
    this.pointLightSecond = new THREE.PointLight(PointLightSecond.color, PointLightSecond.intensity, PointLightSecond.distance);

    this.pointLightFirst.position.set(PointLightFirst.position.x, PointLightFirst.position.y, PointLightFirst.position.z);
    this.pointLightSecond.position.set(PointLightSecond.position.x, PointLightSecond.position.y, PointLightSecond.position.z);

    this.scene.add(this.pointLightFirst);
    this.scene.add(this.pointLightSecond);
  }

  update(deltaTime: number): void {
  }
}