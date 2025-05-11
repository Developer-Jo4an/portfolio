export interface StateMachine {
  [key: string]: {
    availableStates: string[],
    nextState?: string,
    isDefault?: boolean,
    isLoading?: boolean,
    isEnableBoosters?: boolean
  };
}

export type IgnoreNextStates<States> = States[]