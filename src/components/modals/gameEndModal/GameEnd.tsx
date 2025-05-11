import {JSX} from "react";
import type {ModalItem} from "../../../providers/modalProvider/types.ts";
import styles from "./GameEnd.module.scss";
import {copyright} from "./copyright.ts";
import {useModal} from "../../../providers/modalProvider/ModalProvider.tsx";
import {applicationStore} from "../../../stateManager/application.ts";

const {buttons, title} = copyright;

export const GameEnd = ({id, props: {status, toRestart}}: ModalItem): JSX.Element => {
  const {closeModal} = useModal();

  const {setState} = applicationStore();

  const buttonActions = {
    toMain: () => {
      setState("main");
      closeModal(id);
    },
    restart: () => {
      toRestart();
      closeModal(id);
    }
  };

  return (
    <div className={styles.gameEndModal}>
      <div className={styles.gameEndModal__container}>
        <div className={styles.gameEndModal__title}>{title[status]}</div>
        {buttons.map(({text, action}) =>
          <button key={action} className={styles.gameEndModal__button} onClick={buttonActions[action]}>
            {text}
          </button>
        )}
      </div>
    </div>
  );
};