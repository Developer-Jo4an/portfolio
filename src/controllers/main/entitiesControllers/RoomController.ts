import {BaseEntityController} from "./BaseEntityController.ts";
import {MainFactory} from "../MainFactory.ts";

const Room = {
  rotation: {x: 0, y: 3.9, z: 0}
};

export class RoomController extends BaseEntityController {
  room: ReturnType<typeof MainFactory.getEntity>;

  constructor(data: BaseEntityController) {
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