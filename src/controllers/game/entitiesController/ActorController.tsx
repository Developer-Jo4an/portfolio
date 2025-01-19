import {BaseEntityController, BaseEntityProps} from "../../main/entitiesControllers/BaseEntityController.ts";
import {EntityType, MainFactory} from "../../main/MainFactory.ts";

export class ActorController extends BaseEntityController {
  actor: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.actor = MainFactory.getEntity("actor");
    this.scene.add(this.actor);
  }
}
