import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";

const Room = {
  rotation: {x: 0, y: 3.9, z: 0}
};

export class RoomController extends BaseEntityController {
  room: EntityType;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    this.room = MainFactory.getEntity("room");
    this.room.rotation.set(Room.rotation.x, Room.rotation.y, Room.rotation.z);
    this.scene.add(this.room);
  }

  update(deltaTime: number): void {

  }
}
