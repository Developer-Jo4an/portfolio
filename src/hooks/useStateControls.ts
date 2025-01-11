import {useAppDispatch} from "../stateManager/stateManagerHooks.ts";
import appSlice from "../stateManager/slices/appSlice.ts";
import {useMemo} from "react";

interface StateControls {
  setState: (newState: string) => void;
  nextState: () => void;
}

export const useStateControls = (): StateControls => {
  const dispatch = useAppDispatch();

  return useMemo((): StateControls => ({
    setState: (newState: string): void => {
      dispatch(appSlice.actions.setState(newState));
    },
    nextState: (): void => {
      dispatch(appSlice.actions.setNextState());
    }
  }), []);
};