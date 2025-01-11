import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {UniversalModal} from "../modals/UniversalModal.tsx";

//todo: потестить хук

type ModalDataProps = { type: string; props: { isQueue?: boolean }; }

type ModalData = ModalDataProps & { id: number }

type CloseModalProps = Partial<Omit<ModalData, "props">>

type UseModalData = {
  addModal: (modal: ModalData) => void;
  closeModal: (closeProps: CloseModalProps) => void;
}

type ModalsDataContext = { useModal: UseModalData } | null

const ModalContext: React.Context<ModalsDataContext> = createContext(null);

export const useModalContext = (): ModalsDataContext => useContext(ModalContext);

const modalsData: { [modalType: string]: React.FC } = {
  universal: UniversalModal
};

const addWithPrev = (modal: ModalData): (prev: ModalData[]) => ModalData[] => {
  return (prev: ModalData[]): ModalData[] => [...prev, modal];
};

const closeModal = (modal: CloseModalProps): (prev: ModalData[]) => ModalData[] => {
  return (prev: ModalData[]): ModalData[] => prev.filter(({type, id}) => modal.type !== type && modal.id !== id);
};

let counter: number = 0;

export const ModalProvider = ({children}: { children: React.ReactNode }) => {
  const [modals, setModal] = useState<ModalData[]>([]);
  const [queue, setQueue] = useState<ModalData[]>([]);

  const useModal: UseModalData = useMemo((): UseModalData => {
    return {
      addModal: ({type, props}: ModalDataProps): void => {
        if (!modalsData.hasOwnProperty(type)) return;

        const id: number = ++counter;

        if (!props.isQueue || !modals.length) {
          setModal(addWithPrev({type, id, props}));
          return;
        }

        setQueue(addWithPrev({type, id, props}));
      },
      closeModal: ({type, id}): void => {
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

    const [modal]: ModalData = queue[0];

    setQueue((prev: ModalData[]): ModalData[] => prev.slice(1));

    setModal(addWithPrev(modal));
  }, [queue, modals]);

  return (
    <ModalContext.Provider value={{useModal}}>
      {children}
      <div className={"modal-area"}>{
        modals.map((modal: ModalData): React.ReactNode => {
          const {type, props}: ModalData = modal;
          const Component: React.FC = modalsData[type];
          return <Component {...props}/>;
        })
      }</div>
    </ModalContext.Provider>
  );
};