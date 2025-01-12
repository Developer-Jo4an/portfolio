export type LoadersType = "threeTexture" | "threeRgbe" | "threeGltf"

export type PreloadData = {
  path: string,
  name: string,
  type: LoadersType,
}

export type PreloadDataArray = PreloadData[]

export type PreloadDataObject = {
  [preloadId: string]: PreloadDataArray
}

const basePath: string = "scenesAssets/";

const createPath = (src: string): string => basePath + src;

export const preloadData: PreloadDataObject = {
  main: [
    {
      path: createPath("gltf/character/character.gltf"),
      name: "character",
      type: "threeGltf"
    },
    {
      path: createPath("main/floor.jpg"),
      name: "floor",
      type: "threeTexture"
    },
    {
      path: createPath("gltf/room/room.gltf"),
      name: "room",
      type: "threeGltf"
    }
  ]
};
