import * as React from "react";
import MainMenu from "../components/mainMenu/MainMenu.tsx";
import Game from "../components/game/Game.tsx";

export interface StateMachineProp {
  availableStates: string[],
  nextState?: string,
  isDefault?: boolean
}

export type StateMachineKey = string

interface StateMachine {
  mainMenu: StateMachineProp;

  [propName: StateMachineKey]: StateMachineProp;
}

export const stateMachine: StateMachine = {
  mainMenu: {availableStates: ["game"], isDefault: true},
  game: {availableStates: ["mainMenu"]}
};

export const getNextState = (currentState: string): string | undefined => {
  const availableStates: string[] | undefined = stateMachine[currentState]?.availableStates;
  const nextState: string | undefined = stateMachine[currentState]?.nextState;

  if (!availableStates || !nextState) return;

  if (availableStates.includes(currentState)) return nextState;

  return;
};

export const isIncludeAvailable = (currentState: string, newState: string): boolean => {
  const availableStates: string[] | undefined = stateMachine[currentState]?.availableStates;

  if (!availableStates) return false;

  return availableStates.includes(newState);
};

export interface StateComponents {
  [propName: string]: React.FC;
}

export const statesComponents: StateComponents = {
  mainMenu: MainMenu,
  game: Game
};
