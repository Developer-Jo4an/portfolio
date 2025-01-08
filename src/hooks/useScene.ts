import {useEffect, useState} from "react";
import {MainWrapper} from "../controllers/main/MainWrapper.ts";

type SceneType = "main" | "game"

type Wrappers = {
  main: typeof MainWrapper;
}

export const useScene = (type: SceneType, container: HTMLDivElement | null) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  type WrapperType = InstanceType<Wrappers[SceneType]>;

  const [wrapper, setWrapper] = useState<WrapperType | null>(null);

  useEffect((): void => {
    if (!isLoaded || !container) return;

    const wrappers: Wrappers = {
      main: MainWrapper
    };

    const WrapperCls: Wrappers[SceneType] = wrappers[type];

    const wrapperInstance: WrapperType = new WrapperCls(container);

    wrapperInstance.addCanvas();

    setWrapper(wrapperInstance);
  }, [type, isLoaded, container]);

  useEffect((): void => {
    (async (): Promise<void> => {
      const THREE = await import("three");
      const THREEAddons = await import("three/addons");
      const GSAP = await import("gsap");
      window.THREEAddons = THREEAddons;
      window.THREE = THREE;
      window.GSAP = GSAP;
      setIsLoaded(true);
    })();
  }, []);

  return {wrapper};
};
