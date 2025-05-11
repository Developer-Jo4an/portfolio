import {useModal} from "../../providers/modalProvider/ModalProvider.tsx";

export const useGameReducers = ({setState}) => {
  const {addModal} = useModal();

  const toRestart = (): void => {
    setState("reset");
  };

  return {
    lose: () => addModal({type: "gameEnd", props: {status: "lose", toRestart}}),
    win: () => addModal({type: "gameEnd", props: {status: "win", toRestart}})
  };
};
