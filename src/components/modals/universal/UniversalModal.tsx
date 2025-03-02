import React from "react";
import {ModalComponent} from "../../modalProvider/ModalProvider.tsx";

interface UniversalModalProps extends ModalComponent {
}

export const UniversalModal = ({modalId}: UniversalModalProps) => {
  return (
    <div className={"universal-modal"}>
      <div className={"universal-modal__content"}>
        Здесь я объясню, каким образом буду управлять игрой
      </div>
    </div>
  );
};
