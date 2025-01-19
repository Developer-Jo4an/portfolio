import {useEffect, useMemo, useRef} from "react";
import {AppCallbacks, useAppCallbacks, useAppSelector} from "../stateManager/stateManagerHooks.ts";
import {InitialAppState, useAppSliceData} from "../stateManager/slices/appSlice.ts";
import {useModal, UseModalData} from "../components/modalProvider/ModalProvider.tsx";

type ReturnType = (() => void) | undefined;

export const useStateCallback = (): ReturnType => {
  const {state}: InitialAppState = useAppSelector(useAppSliceData);
  const appCallbacks: AppCallbacks = useAppCallbacks();
  const {addModal}: UseModalData = useModal();
  const timeout = useRef<number | null>(null);

  const callback: ReturnType = useMemo((): ReturnType => ({
    mainMenu: (): void => {

    },
    game: (): void => {
      timeout.current = window.setTimeout((): void => {
        addModal({type: "gameControls"});
      }, 1000);
    }
  })[state], [state]);

  useEffect((): () => void => {
    return (): void => {
      if (typeof timeout.current === "number")
        clearTimeout(timeout.current);
    };
  }, [state]);

  return callback;
};
