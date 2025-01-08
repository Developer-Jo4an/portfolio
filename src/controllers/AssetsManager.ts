import {AssetType, PreloadData, PreloadDataArray} from "./main/preload.ts";

type EntityType = THREE.Texture | THREE.Group

type LoadersType = THREE.TextureLoader | THREEAddons.GLTFLoader | THREEAddons.RGBELoader

export class AssetsManager {
  private static library: { [propName: AssetType]: { [key: string]: EntityType } } = {};

  private static loaders: { [propName: AssetType]: LoadersType } = {};

  static setToLibrary(type: AssetType, value: EntityType, name: string): void {
    if (!AssetsManager.library.hasOwnProperty(type))
      AssetsManager.library[type] = {[name]: value};

    AssetsManager.library[type][name] = value;
  }

  static getEntityByName(name: string, type: AssetType): EntityType | undefined {
    return AssetsManager.library[type][name];
  }

  static async loadEntity({path, name, type, params}: PreloadData): Promise<EntityType> {
    const loaderLogic: {
      texture: () => Promise<THREE.Texture>,
      rgbe: () => Promise<THREE.Texture>,
      gltf: () => Promise<THREE.Group>
    } = {
      texture: async () => {
        return AssetsManager.loaders[type].load(path);
      },
      rgbe: async () => {
        return AssetsManager.loaders[type].load(path);
      },
      gltf: async () => {
        const splitPath: string[] = path.split("/");
        const fileName: string = splitPath[splitPath.length - 1];
        const basePath: string = `${splitPath.slice(0, splitPath.length - 1).join("/")}/`;
        AssetsManager.loaders[type].setPath(basePath);
        return new Promise(res => {
          AssetsManager.loaders[type].load(fileName, gltf => res(gltf.scene));
        });
      }
    };

    const entity: EntityType = await loaderLogic[type]();

    AssetsManager.setToLibrary(type, entity, name);

    return entity;
  }

  static createLoaders(preloadData: PreloadDataArray): void {
    const loaders: { [propName: string]: LoadersType } = {};

    const Loaders: {
      texture: typeof THREE.TextureLoader,
      gltf: typeof THREEAddons.GLTFLoader,
      rgbe: typeof THREEAddons.RGBELoader
    } = {
      texture: THREE.TextureLoader,
      gltf: THREEAddons.GLTFLoader,
      rgbe: THREEAddons.RGBELoader
    };

    preloadData.forEach((data: PreloadData) => {
      if (loaders.hasOwnProperty(data.type)) return;
      loaders[data.type] = new Loaders[data.type]();
    });

    AssetsManager.loaders = loaders;
  }
}
