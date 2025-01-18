import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";

const Room = {
  position: {x: 0, y: -5, z: 0},
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
    console.log(this.room);
    this.room.traverse(obj => {
      if (obj?.isMesh) {
        obj.name === "room" ? obj.receiveShadow = true : obj.castShadow = true;
      }
    });
    this.room.rotation.set(Room.rotation.x, Room.rotation.y, Room.rotation.z);
    this.room.position.set(Room.position.x, Room.position.y, Room.position.z);
    this.scene.add(this.room);
  }

  update(deltaTime: number): void {

  }
}
