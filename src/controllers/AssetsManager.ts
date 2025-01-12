import {LoadersType, PreloadData, PreloadDataArray} from "./preload.ts";

const loadersLibrary: { [loaderName: LoadersType]: new (...args: any[]) => any } = {
  threeTexture: THREE.TextureLoader,
  threeGltf: THREEAddons.GLTFLoader,
  threeRgbe: THREEAddons.RGBELoader
};

//todo: подумать над any

type LoaderReturnValueType = any

type LoaderType = typeof loadersLibrary[keyof typeof loadersLibrary]

type LibraryItemType = { [key: string]: LoaderReturnValueType }

export class AssetsManager {
  private static library: { [libraryPart: LoadersType]: LibraryItemType } = {};

  private static loaders: { [loaderType: LoadersType]: LoaderType } = {};


  public static setToLibrary(type: LoadersType, value: LoaderReturnValueType, name: string): void {
    let subLibrary: LibraryItemType | undefined = AssetsManager.library[type];

    if (!subLibrary)
      subLibrary = AssetsManager.library[type] = {};

    if (subLibrary.hasOwnProperty(name))
      throw new Error("Entity with the same name already exists in the library");

    subLibrary[name] = value;
  }


  public static getEntityByName(name: string, type: LoadersType): LoaderReturnValueType | never {
    const item: LoaderReturnValueType = AssetsManager.library[type][name];

    if (!item)
      throw new Error("Entity with the same name not found in the library");

    return item;
  }


  public static async loadEntity(
    {path, name, type}: PreloadData & { type: LoadersType }):
    Promise<LoaderReturnValueType | never> {
    const necessaryLoader: LoaderType = AssetsManager.loaders[type]; //todo: взять из массива классы

    if (!necessaryLoader)
      throw new Error("Loader not found");

    const loaderLogic: {
      [key: LoadersType]: () => Promise<LoaderReturnValueType>
    } = {
      threeTexture: async () => {
        return necessaryLoader.load(path);
      },
      threeRgbe: async () => {
        return necessaryLoader.load(path);
      },
      threeGltf: async () => {
        const splitPath: string[] = path.split("/");
        const fileName: string = splitPath[splitPath.length - 1];
        const basePath: string = `${splitPath.slice(0, splitPath.length - 1).join("/")}/`;

        necessaryLoader.setPath(basePath);

        return new Promise((res): void => {
          necessaryLoader.load(fileName, gltf => res(gltf.scene));
        });
      }
    };

    const entity: LoaderReturnValueType = await loaderLogic[type]();

    AssetsManager.setToLibrary(type, entity, name);

    return entity;
  }


  public static createLoaders(preloadData: PreloadDataArray): void {
    preloadData.forEach(({type}: PreloadData) => {
      if (AssetsManager.hasOwnProperty(type)) return;

      if (!loadersLibrary.hasOwnProperty(type))
        throw new Error("Loader not found");

      AssetsManager.loaders[type] = new loadersLibrary[type]();
    });
  }
}
