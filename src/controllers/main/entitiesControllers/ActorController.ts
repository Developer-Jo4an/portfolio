import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";

const Actor = {
  position: {x: 0, y: 2.36, z: 6},
  scale: {x: 2, y: 2, z: 2}
};

export class ActorController extends BaseEntityController {
  actor: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.actor = MainFactory.getEntity("actor");
    this.actor.traverse(obj => {
      if (obj?.isMesh) {
        obj.castShadow = true;
      }
    });
    this.actor.position.set(Actor.position.x, Actor.position.y, Actor.position.z);
    this.actor.scale.set(Actor.scale.x, Actor.scale.y, Actor.scale.z);
    this.scene.add(this.actor);
  }

  update(deltaTime: number): void {

  }
}
