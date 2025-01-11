import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {UniversalModal} from "../modals/universal/UniversalModal.tsx";
import {AnimatePresence, motion} from "framer-motion";

type ModalDataProps = { type: string; props?: { isQueue?: boolean }; }

type ModalData = ModalDataProps & { id: number }

type CloseModalProps = Partial<Omit<ModalData, "props">>

type UseModalData = {
  addModal: (modal: ModalDataProps) => void;
  closeModal: (closeProps: CloseModalProps) => void;
}

type ModalsDataContext = { useModal: UseModalData }

export type ModalComponent = { modalId: number }

const ModalContext: React.Context<ModalsDataContext> = createContext({
  useModal: {
    addModal: (modal: ModalDataProps) => {
    },
    closeModal: (closeProps: CloseModalProps) => {
    }
  }
});

export const useModal = (): UseModalData => useContext(ModalContext).useModal;

const modalsData: { [modalType: string]: React.FC } = {
  universal: UniversalModal
};

const addWithPrev = (modal: ModalData) => {
  return prev => [...prev, modal];
};

const closeModal = (modal: CloseModalProps) => {
  return prev => prev.filter(({type, id}) => modal.type !== type && modal.id !== id);
};

let actualModalId: number = 0;

export const ModalProvider = ({children}: { children: React.ReactNode }) => {
  const [modals, setModal] = useState<ModalData[]>([]);
  const [queue, setQueue] = useState<ModalData[]>([]);

  const useModal: UseModalData = useMemo(() => {
    return {
      addModal: ({type, props}: ModalDataProps): void => {
        if (!modalsData.hasOwnProperty(type)) return;

        const id: number = ++actualModalId;

        if (!props?.isQueue) {
          setModal(addWithPrev({type, id, props}));
          return;
        }

        setQueue(addWithPrev({type, id, props}));
      },
      closeModal: ({type, id}: CloseModalProps): void => {
        if (!type && !id) return;

        const callbacks: { [callbackType: string]: () => void } = {
          allModals: (): void => {
            setModal([]);
          },
          allQueue: (): void => {
            setQueue([]);
          },
          all: (): void => {
            setQueue([]);
            setModal([]);
          }
        };

        if (callbacks[type]) {
          callbacks[type]();
          return;
        }

        setModal(closeModal({type, id}));
        setQueue(closeModal({type, id}));
      }
    };
  }, [modals]);

  useEffect((): void => {
    if (!queue.length || modals.length) return;

    const [modal]: ModalData = queue;

    setQueue(prev => prev.slice(1));

    setModal(addWithPrev(modal));
  }, [queue, modals]);

  return (
    <ModalContext.Provider value={{useModal}}>
      {children}
      <div className={"modal-area"}>
        <AnimatePresence>{
          modals.map((modal): React.ReactNode => {
            const {type, props, id} = modal;
            const ModalComponent: React.FC = modalsData[type];
            return (<motion.div
              key={id}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              initial={{opacity: 0}}
              transition={{duration: 0.5}}
            >
              <ModalComponent modalId={id} {...props}/>
            </motion.div>);
          })
        }</AnimatePresence>
      </div>
    </ModalContext.Provider>
  );
};