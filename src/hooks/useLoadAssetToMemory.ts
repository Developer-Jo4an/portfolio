import axios from "axios";
import {useState} from "react";

type AssetsType = { name: string, url: string }

type Assets = AssetsType[]

type LoadedAssets = {
  [key: string]: string
}

type ResolveType = Promise<string[]>

type LoadFunction = (assets: Assets) => ResolveType

const cashedAssets: LoadedAssets = {};

export const useLoadAssetToMemory = (): { loadedAssets: LoadedAssets, load: LoadFunction } => {
  const [loadedAssets, setLoadedAssets] = useState<LoadedAssets>(cashedAssets);

  const load = async (assets: Assets): ResolveType => {
    const assetsData = await Promise.all(assets.map(async ({name, url}: AssetsType) => {
      try {
        const {data} = await axios.get(url, {responseType: "blob"});
        return cashedAssets[name] = URL.createObjectURL(data);
      } catch {
        return url;
      }
    }));

    setLoadedAssets({...cashedAssets});

    return assetsData;
  };

  return {loadedAssets, load};
};