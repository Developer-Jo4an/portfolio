import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {MainFactory} from "../MainFactory.ts";

export class ActorController extends BaseEntityController {
  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    type ActorType = ReturnType<typeof MainFactory.getEntity>
    const actor: ActorType = MainFactory.getEntity("actor");
    this.scene.add(actor);
  }

  update(deltaTime: number): void {

  }
}
