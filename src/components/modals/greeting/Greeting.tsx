// @ts-nocheck

import type {ModalItem} from "../../../providers/modalProvider/types.ts";
import {JSX} from "react";
import {useModal} from "../../../providers/modalProvider/ModalProvider.tsx";
import {copyright} from "./copyright.ts";
import styles from "./Greeting.module.scss";

const {text, title, button: {text: buttonText}} = copyright;

export const Greeting = ({id}: ModalItem): JSX.Element => {
  const {closeModal} = useModal();

  return (
    <div className={styles.greeting}>
      <div className={styles.greeting__title}>{title}</div>
      <div className={styles.greeting__container}>{text}</div>
      <button className={styles.greeting__button} onClick={() => closeModal(id)}>{buttonText}</button>
    </div>
  );
};