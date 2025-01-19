import {BaseFactory} from "../BaseFactory.ts";
import {upperFirstLetter} from "../../utils/register.ts";
import {AssetsManager} from "../AssetsManager.ts";

export type EntityType = THREE.Group

export class MainFactory extends BaseFactory {
  public static getEntity(type: "actor" | "room"): EntityType | never {

    const entity: EntityType | undefined = MainFactory.getFromLibraryByType<EntityType>(type);

    if (entity) return entity;

    const necessaryCallback: (() => EntityType) | undefined = MainFactory[`create${upperFirstLetter(type)}`];

    if (!necessaryCallback)
      throw new Error("Create entity callback not found");

    const element: EntityType = necessaryCallback();

    MainFactory.setToLibrary<EntityType>(type, element);

    return element;
  }

  private static createActor(): EntityType {
    return AssetsManager.getEntityByName("character", "threeGltf");
  }

  private static createRoom(): EntityType {
    return AssetsManager.getEntityByName("room", "threeGltf");
  }
}
