import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";

const AmbLight = {color: 0xffffff, intensity: 1};

const SpotLight = {
  color: 0xffffff,
  intensity: 2,
  distance: 500,
  angle: Math.PI / 5,
  penumbra: 0,
  decay: 1,
  power: 750,
  position: {x: 0, y: 50, z: 80},
  target: {x: 0, y: 2.65, z: 15}
};

//pos: 0 - 50 - 80: target - 0 - 2.65 - 15
export class LightController extends BaseEntityController {
  ambientLight: THREE.AmbientLight;
  spotLight: THREE.SpotLight;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.ambientLight = new THREE.AmbientLight(AmbLight.color, AmbLight.intensity);
    this.scene.add(this.ambientLight);

    this.spotLight = new THREE.SpotLight(
      SpotLight.color,
      SpotLight.intensity,
      SpotLight.distance,
      SpotLight.angle,
      SpotLight.penumbra,
      SpotLight.decay
    );

    this.spotLight.position.set(SpotLight.position.x, SpotLight.position.y, SpotLight.position.z);
    const target = new THREE.Object3D();
    target.position.set(SpotLight.target.x, SpotLight.target.y, SpotLight.target.z);
    this.spotLight.power = SpotLight.power;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.needsUpdate = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.target = target;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(this.spotLightHelper);
    target.updateMatrixWorld();
    this.spotLight.updateMatrixWorld();
    this.spotLightHelper.update();

  }

  update(deltaTime: number): void {
    this.spotLightHelper.update();
  }
}