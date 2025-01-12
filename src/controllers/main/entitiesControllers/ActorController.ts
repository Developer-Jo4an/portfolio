import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";

const Actor = {
  position: {x: 0, y: 1.6, z: 0}
}

export class ActorController extends BaseEntityController {
  actor: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.actor = MainFactory.getEntity("actor");
    this.actor.position.set(Actor.position.x, Actor.position.y, Actor.position.z);
    this.scene.add(this.actor);
  }

  update(deltaTime: number): void {

  }
}
