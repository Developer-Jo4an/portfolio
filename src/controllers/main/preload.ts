export type AssetType = "texture" | "gltf" | "rgbe"

export type PreloadData = {
  path: string,
  name: string,
  type: AssetType,
  params?: { [propName: string]: any }
}

export type PreloadDataArray = PreloadData[]

const basePath: string = "scenesAssets/";

export const preloadData: PreloadDataArray = [
  {
    path: basePath + "gltf/character/character1.gltf",
    name: "character",
    type: "gltf"
  },
  {
    path: basePath + "main/floor.jpg",
    name: "floor",
    type: "texture"
  },
  {
    path: basePath + "main/background.hdr",
    name: "background",
    type: "rgbe"
  }
];