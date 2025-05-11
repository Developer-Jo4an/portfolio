import {useEffect} from "react";
import {useModal} from "../providers/modalProvider/ModalProvider.tsx";
import {storage} from "../utils/storage/storage.ts";

export const useGreeting = (): void => {
  const {addModal} = useModal();

  useEffect((): void => {
    const greetingStorage = storage("isGreeting");

    if (!greetingStorage.get()) {
      addModal({type: "greeting"});
      greetingStorage.set(true);
    }
  }, []);
};