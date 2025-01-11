import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {MainFactory} from "../MainFactory.ts";

const DirLight = {
  position: {x: 0, y: 1.5, z: 3},
  intensity: 2,
  color: 0xffffff
};

const AmbLight = {
  color: 0xffffff,
  intensity: 1
};

const PointLight = {
  position: {x: 0, y: 3, z: 0},
  color: 0xffffff,
  intensity: 2,
  distance: 3
};

export class LightController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  pointLight: THREE.PointLight;
  target: ReturnType<typeof MainFactory.getEntity>;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.ambientLight = new THREE.AmbientLight(AmbLight.color, AmbLight.intensity);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(DirLight.color, DirLight.intensity);
    this.target = MainFactory.getEntity("actor");
    this.directionalLight.target = this.target;
    this.directionalLight.position.set(DirLight.position.x, DirLight.position.y, DirLight.position.z);
    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(PointLight.color, PointLight.intensity, PointLight.distance);
    this.pointLight.position.set(PointLight.position.x, PointLight.position.y, PointLight.position.z);
    this.scene.add(this.pointLight);
  }

  update(deltaTime: number): void {
  }
}