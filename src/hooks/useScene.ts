import {useEffect, useState} from "react";
import {MainWrapper} from "../controllers/main/MainWrapper.ts";
import {GameWrapper} from "../controllers/game/GameWrapper.ts";

type SceneType = "main" | "game"

type Wrappers = {
  main: typeof MainWrapper;
  game: typeof GameWrapper;
}

export const useScene = (type: SceneType, container: HTMLDivElement | null): {wrapper: GameWrapper | MainWrapper | null} => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  type WrapperType = InstanceType<Wrappers[SceneType]>;

  const [wrapper, setWrapper] = useState<WrapperType | null>(null);

  useEffect((): void => {
    if (!isLoaded || !container) return;

    const wrappers: Wrappers = {
      main: MainWrapper,
      game: GameWrapper
    };

    const WrapperCls: Wrappers[SceneType] = wrappers[type];

    const wrapperInstance: WrapperType = new WrapperCls(container);

    setWrapper(wrapperInstance);
  }, [type, isLoaded, container]);

  useEffect((): void => {
    (async (): Promise<void> => {
      const THREE = await import("three");
      const THREEAddons = await import("three/addons");
      const GSAP = await import("gsap");

      window.THREEAddons = THREEAddons;
      window.THREE = THREE;
      window.GSAP = GSAP.gsap;

      setIsLoaded(true);
    })();
  }, []);

  return {wrapper};
};
