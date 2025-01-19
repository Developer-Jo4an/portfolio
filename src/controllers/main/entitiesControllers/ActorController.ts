import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";
import {Constants} from "../../../constants/scene/constants.ts";
import {utils} from "../../../constants/scene/utils.ts";

const constants: Constants = {
  actor: {
    transformation: {
      position: {x: 5, y: 0, z: -5},
      scale: {x: 2, y: 2, z: 2}
    }
  }
};

export class ActorController extends BaseEntityController {
  actor: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    const {actor} = constants;

    this.actor = MainFactory.getEntity("actor");

    this.actor.isNotDestroyed = true;

    this.actor.traverse((obj: THREE.Object3D) => obj.isMesh && (obj.castShadow = true));

    utils.setTransformation<EntityType>(actor.transformation, this.actor);

    this.scene.add(this.actor);
  }

  update(deltaTime: number): void {

  }
}
