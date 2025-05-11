import {create} from "zustand";
import {states} from "../constants/states.ts";
import {immer} from "zustand/middleware/immer";

type ApplicationStore = {
  state: string,
  prevStates: string[],
  setState: (newState: string) => void,
  setPrevState: () => void
}

export const applicationStore = create<ApplicationStore>()(immer(set => ({
  state: Object.entries(states).find(([, value]) => value.isDefault)?.[0],
  prevStates: [],
  setState: (newState: string) => set(state => {
    if (states[state.state].availableStates.includes(newState)) {
      state.prevStates.push(state.state);
      state.state = newState;
    } else throw new Error(`state is not available: ${newState}`);
  }),
  setPrevState: () => set(state => {
    if (!state.prevStates.length)
      throw new Error("prevStates array is empty");
    state.state = state.prevStates.pop();
  })
})));