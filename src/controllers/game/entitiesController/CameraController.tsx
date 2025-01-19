import {BaseEntityController, BaseEntityProps} from "../../main/entitiesControllers/BaseEntityController.ts";
import {EntityType, MainFactory} from "../../main/MainFactory.ts";
import {Constants} from "../../../constants/scene/constants.ts";

const constants: Constants = {
  distanceFromActor: {x: 0, y: 10, z: -10},
  lookAtOffset: {x: 0, y: 0, z: 0}
};

export class CameraController extends BaseEntityController {
  actor: EntityType;
  controls: THREEAddons.OrbitControls;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.actor = MainFactory.getEntity("actor");
    console.log(this.camera, this.canvas);
    this.controls = new THREEAddons.OrbitControls(this.camera, this.canvas);
  }

  updateCameraPosition(): void {
    const {distanceFromActor} = constants;
    const {x, y, z}: THREE.Vector3 = this.actor.position;
    const cameraPosition: number[] = [x + distanceFromActor.x, y + distanceFromActor.y, z + distanceFromActor.z];
    this.camera.position.set(...cameraPosition);
  }

  updateCameraLookAt(): void {
    const {lookAtOffset} = constants;
    const {x, y, z}: THREE.Vector3 = this.actor.position;
    const cameraLookAt: number[] = [x + lookAtOffset.x, y + lookAtOffset.y, z + lookAtOffset.z];
    this.camera.lookAt(...cameraLookAt);
  }

  update(deltaTime: number): void {
    // this.updateCameraLookAt();
    this.controls.update();
  }
}
