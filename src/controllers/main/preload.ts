export type AssetType = "texture" | "gltf" | "rgbe"

export type PreloadData = {
  path: string,
  name: string,
  type: AssetType,
  params?: { [propName: string]: any }
}

export type PreloadDataArray = PreloadData[]

const basePath: string = "scenesAssets/";

const createPath = (src: string): string => basePath + src;

export const preloadData: PreloadDataArray = [
  {
    path: createPath("gltf/character/character.gltf"),
    name: "character",
    type: "gltf"
  },
  {
    path: createPath("main/floor.jpg"),
    name: "floor",
    type: "texture"
  },
  {
    path: createPath("gltf/room/room.gltf"),
    name: "room",
    type: "gltf"
  }
];