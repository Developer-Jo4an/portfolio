import {JSX} from "react";
import {Main} from "../components/main/Main.tsx";
import {PuzzleBlock} from "../components/puzzleBlock/PuzzleBlock.tsx";

interface Components {
  [key: string]: () => JSX.Element;
}

export const components: Components = {
  main: Main,
  puzzleBlock: PuzzleBlock
};