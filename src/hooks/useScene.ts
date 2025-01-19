import {createWrapperPath, WrapperId} from "../controllers/config.ts";
import {useEffect, useState} from "react";
import {StateMachineProp} from "../stateMachine/stateMachine.tsx";

interface useSceneProps {
  container: { current: HTMLDivElement | null };
  wrapperType: WrapperId;
  stateMachine: { [stateName: string]: StateMachineProp };
  reducers?: {
    [stateName: string]: { [callbackKey: "before" | "after"]: () => Promise<void> | void }
  };
}

type useSceneRequiredType = { wrapper: InstanceType<new () => any> | null } | never

export const useScene = ({container, wrapperType, stateMachine, reducers}: useSceneProps): useSceneRequiredType => {
  const [wrapper, setWrapper] = useState(null);
  const [containerState, setContainerState] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState<string | undefined>(Object.entries(stateMachine).find(([_, state]) => state.isDefault)?.[0]);

  if (!state) // явный вылет из приложения, если не указан state по умолчанию
    throw new Error("No default state");


  useEffect((): void => {
    if (!wrapper) return;

    // todo: смена стейта внутри контроллера будет тольео через eventBus и через специальный метод,
    // todo который изменит тут state(в хуке) и у нас отработает данный useEffect еще раз

    (async (): Promise<void> => {
      await reducers?.[state]?.before?.();
      wrapper.eventBus.dispatchEvent({type: "state:change", state});
      reducers?.[state]?.after?.();
    })();
  }, [wrapper, state]);

  useEffect((): undefined | (() => void) => {
    if (!containerState) return;

    let wrapperInstance;

    (async (): Promise<void> => {
      window.THREE = await import("three");
      window.THREEAddons = await import("three/addons");
      window.GSAP = (await import("gsap")).gsap;

      const WrapperClass = (await import(createWrapperPath(wrapperType))).default;

      const wrapper = new WrapperClass(containerState);

      await wrapper.initController();

      setWrapper(wrapperInstance = wrapper);
    })();
  }, [containerState]);

  useEffect((): () => void => {
    return (): void => {
      wrapper && wrapper.reset();
    };
  }, [wrapper]);

  useEffect((): void => {
    setContainerState(container.current);
  }, [container.current]);

  return {wrapper};
};


