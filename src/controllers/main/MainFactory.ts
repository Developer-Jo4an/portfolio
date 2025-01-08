import {BaseFactory} from "../BaseFactory.ts";
import {upperFirstLetter} from "../../utils/register.ts";
import {AssetsManager} from "../AssetsManager.ts";

//todo: типизировать

type EntityTypeType = "actor"

type EntityType = THREE.Group

export class MainFactory extends BaseFactory {
  static getEntity(type: EntityTypeType): EntityType | never {

    const entity: undefined | EntityType = MainFactory.getFromLibraryByType<EntityType>(type);

    if (entity)
      return entity;

    const necessaryCallback: Function | undefined = MainFactory[`create${upperFirstLetter(type)}`];

    if (!necessaryCallback)
      throw new Error("Entity not found");

    type EntityElType = ReturnType<typeof necessaryCallback>;

    const element: EntityElType = necessaryCallback(type);

    MainFactory.setToLibrary<EntityElType>(type, element);

    return MainFactory.getFromLibraryByType<EntityElType>(type);
  }

  static createActor(type: string): EntityType | void {
    const actor: THREE.Group | undefined = AssetsManager.getEntityByName("character", "gltf");

    if (actor) {
      actor.name = type;
      return actor;
    }
  }
}
