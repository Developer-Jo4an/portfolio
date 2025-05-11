import type {ModalItem} from "../../../providers/modalProvider/types.ts";
import {JSX, useEffect} from "react";
import {useModal} from "../../../providers/modalProvider/ModalProvider.tsx";

export const Greeting = ({id, type, props}: ModalItem): JSX.Element => {

  const {closeModal} = useModal();

  useEffect((): void => {
    setTimeout((): void => {
      closeModal(id);
    }, 1500);
  }, []);

  return (
    <div>Hello{id}{type}</div>
  );
};