import {ModalComponent, useModal} from "../../modalProvider/ModalProvider.tsx";
import Button from "../../baseComponents/button/Button.tsx";
import {IoMdCloseCircle} from "react-icons/io";

interface UniversalModalProps extends ModalComponent {
}

export const GameControlsModal = ({modalId}: UniversalModalProps) => {
  const {closeModal} = useModal();

  const closeModalFunc = (): void => {
    closeModal({id: modalId});
  };

  return (
    <div className={"game-controls-modal"}>
      <div className={"game-controls-modal__container"}>
        <Button className={"game-controls-modal__close-button"} disposable={true} onClick={closeModalFunc}>
          <IoMdCloseCircle/>
        </Button>
        <div className={"game-controls-modal__content"}>
          Здесь я объясню, каким образом буду управлять игрой
        </div>
      </div>
    </div>
  );
};
