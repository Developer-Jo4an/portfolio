import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";
import {
  getNextState,
  isIncludeAvailable,
  stateMachine,
  StateMachineKey,
  StateMachineProp
} from "../../stateMachine/stateMachine.tsx";

export interface InitialAppState {
  state: string;
}

const initialState: InitialAppState = {
  state: Object.entries(stateMachine).find(([_, value]: [StateMachineKey, StateMachineProp]) => value.isDefault)?.[0] ?? "mainMenu"
};

const sliceName: string = "app";

const appSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNextState: (state): void => {
      const nextState: string | undefined = getNextState(state.state);

      if (nextState)
        state.state = nextState;
    },
    setState: (state, action: PayloadAction<string>): void => {
      if (isIncludeAvailable(state.state, action.payload))
        state.state = action.payload;
    }
  }
});

export const useAppSliceData = (state: RootState): InitialAppState => state[sliceName];

export default appSlice;

