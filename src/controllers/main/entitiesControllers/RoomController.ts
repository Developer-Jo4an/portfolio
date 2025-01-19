import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";
import {Constants} from "../../../constants/scene/constants.ts";
import {utils} from "../../../constants/scene/utils.ts";
import {Object3D} from "three";

const constants: Constants = {
  transformation: {
    position: {x: 0, y: -7, z: 0}
  }
};

export class RoomController extends BaseEntityController {
  room: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.room = MainFactory.getEntity("room");
    this.room.isNotDestroyed = true;
    this.room.traverse((obj: Object3D) => obj.name !== "room" && (obj.castShadow = true));
    utils.setTransformation<EntityType>(constants.transformation, this.room);
    this.scene.add(this.room);
  }

  update(deltaTime: number): void {

  }
}
