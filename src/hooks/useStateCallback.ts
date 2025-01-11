import {useEffect} from "react";
import {AppCallbacks, useAppCallbacks, useAppSelector} from "../stateManager/stateManagerHooks.ts";
import {InitialAppState, useAppSliceData} from "../stateManager/slices/appSlice.ts";

interface StateCallbacks {
  [propName: string]: () => void;
}

export const useStateCallback = (): void => {
  const {state}: InitialAppState = useAppSelector(useAppSliceData);
  const appCallbacks: AppCallbacks = useAppCallbacks();

  useEffect((): void => {
    const stateCallbacks: StateCallbacks = {
      mainMenu: (): void => {

      },
      game: (): void => {

      }
    };

    stateCallbacks[state]?.();
  }, [state]);
};