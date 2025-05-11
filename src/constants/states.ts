type State = {
  availableStates: string[],
  isDefault?: true
}

type DefaultState = State & { isDefault: true }

type States = {
  main: DefaultState,
  [key: string]: State
}

export const states: States = {
  main: {availableStates: ["puzzleBlock"], isDefault: true},
  puzzleBlock: {availableStates: ["main"]},
};