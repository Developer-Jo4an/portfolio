import type {IgnoreNextStates, StateMachine} from "../types/game.ts";

export const stateMachine: StateMachine = {
  loadManifest: {availableStates: ["loading"], nextState: "loading", isDefault: true, isLoading: true},
  loading: {availableStates: ["initializationControllers"], nextState: "initializationControllers", isLoading: true},
  initializationControllers: {availableStates: ["initialization"], nextState: "initialization", isLoading: true},
  initialization: {availableStates: ["showing"], nextState: "showing", isLoading: true},
  showing: {availableStates: ["create"], nextState: "create"},
  create: {availableStates: ["playing"], nextState: "playing"},
  playing: {availableStates: ["winning", "losing", "pause", "boosterEffect"], isEnableBoosters: true},
  boosterEffect: {availableStates: ["playing"], nextState: "playing"},
  losing: {availableStates: ["lose"], nextState: "lose"},
  winning: {availableStates: ["win"], nextState: "win"},
  lose: {availableStates: ["reset"], nextState: "reset"},
  win: {availableStates: ["reset"], nextState: "reset"},
  pause: {availableStates: ["playing", "reset"]},
  reset: {availableStates: ["initialization"], nextState: "initialization"}
};

export const ignoreNextState: IgnoreNextStates<keyof typeof stateMachine> = ["playing", "win", "lose", "winning", "losing", "pause", "boosterEffect"];

export const gameTimelineSpaceId: string = "puzzleBlock";

export const formattedNames: { [key: string]: string } = {
  elements: "square", specialElements: "crystal", gems: "gem", helpers: "helper", effects: "blocker"
};

export const baseLevel: {
  target: { [key: string]: number },
  availableItems: { [key: string]: string[] },
  spawnOrder: { [key: number]: string[] },
  rewards: { [key: string]: number },
  blocksData: { block: [number, number][], id: string, dropChance: number, increment: number, cooldownTurns: number }[],
  grid: { cells: Array<{ elements?: string, gems?: string, specialElements?: string }> }[]
} = {
  target: {
    "gem-2": 10,
    "gem-3": 10,
    "crystal": 2
  },
  availableItems: {
    square: ["square-base-blue", "square-base-yellow", "square-base-purple", "square-base-green", "square-base-red"],
    // helper: ["lightning"],
    blocker: ["ice"],
    gem: ["gem-2", "gem-3"]
  },
  spawnOrder: {
  },
  rewards: {
    star: 2
  },
  blocksData: [
    {
      block: [[0, 0], [1, 0]],
      id: "double-line",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0]],
      id: "triple-line",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [3, 0]],
      id: "quadruple-line",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
      id: "quintuple-line",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
      id: "medium-rectangle",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [2, 1]],
      id: "medium-sized-angle",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
      id: "large-sized-angle",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[1, 0], [0, 1], [1, 1], [2, 1]],
      id: "small-t-shaped",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 1]],
      id: "small-diagonal",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 1], [2, 2]],
      id: "middle-diagonal",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0]],
      id: "small-square",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [0, 1], [1, 1]],
      id: "medium-square",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
      id: "large-square",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [0, 1]],
      id: "stair",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[0, 0], [1, 0], [1, 1], [2, 1]],
      id: "z-shaped",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    },
    {
      block: [[1, 0], [2, 0], [0, 1], [1, 1]],
      id: "z-shaped-revert",
      dropChance: 1,
      increment: 1,
      cooldownTurns: 2
    }
  ],
  grid: [
    {
      cells: [
        {elements: "square-base-blue"}, {},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"}, {},
        {elements: "square-base-blue"}
      ]
    },
    {
      cells: [
        {elements: "square-base-blue"}, {}, {}, {}, {}, {}, {},
        {elements: "square-base-blue"}
      ]
    },
    {
      cells: [
        {}, {},
        {elements: "square-base-red", gems: "gem-2"},
        {elements: "square-base-red", gems: "gem-2"},
        {elements: "square-base-red", gems: "gem-2"},
        {elements: "square-base-red", gems: "gem-2"},
        {}, {}
      ]
    },
    {
      cells: [
        {elements: "square-base-blue"}, {}, {},
        {"specialElements": "crystal"},
        {"specialElements": "crystal"}, {}, {},
        {elements: "square-base-blue"}
      ]
    },
    {
      cells: [
        {elements: "square-base-blue"}, {},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"}, {},
        {elements: "square-base-blue"}
      ]
    },
    {
      cells: [
        {}, {}, {},
        {elements: "square-base-red"},
        {elements: "square-base-red"}, {}, {}, {}
      ]
    },
    {
      cells: [
        {elements: "square-base-blue"}, {},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"}, {},
        {elements: "square-base-blue"}
      ]
    },
    {
      cells: [
        {elements: "square-base-blue"}, {},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"},
        {elements: "square-base-red"}, {},
        {elements: "square-base-blue"}
      ]
    }
  ]
};
