type AssetType = "texture" | "gltf"

export class AssetsManager {
  private static library: { [propName: string]: { [key: string]: any } } = {};

  private static loaders: { texture: THREE.TextureLoader, gltf: THREE.GLTFLoader } = {
    texture: new THREE.TextureLoader(),
    gltf: new THREE.GLTFLoader()
  };

  static async loadEntity(
    path: string,
    name: string,
    type: AssetType,
    params?: { [propName: string]: any }
  ): Promise<any> {

    const loaderLogic: {
      texture: () => Promise<THREE.Texture>,
      gltf: () => Promise<any>
    } = {
      texture: async () => {
        const texture = await AssetsManager.loaders[type].load(path);
        AssetsManager.setToLibrary(type, texture, name);
        return texture;
      },
      gltf: async () => {

      }
    };

    return loaderLogic[type]?.();
  }

  static setToLibrary(type: AssetType, value: any, name: string) {
    if (!AssetsManager.library.hasOwnProperty(type))
      AssetsManager.library[type] = {[name]: value};

    AssetsManager.library[type][name] = value;
  }

  static getEntityByName(name: string, type: AssetType) {
    return AssetsManager.library[type][name];
  }
}
