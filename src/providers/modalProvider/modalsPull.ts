import {JSX} from "react";
import type {ModalItem} from "./types.ts";
import {Greeting} from "../../components/modals/greeting/Greeting.tsx";
import {GameEnd} from "../../components/modals/gameEndModal/GameEnd.tsx";

interface ModalsPull {
  [key: string]: (modalItem: ModalItem) => JSX.Element;
}

export const modalsPull: ModalsPull = {
  greeting: Greeting,
  gameEnd: GameEnd
};