// @ts-nocheck

import type {ReactNode} from "react";
import {createContext, JSX, useContext, useState} from "react";
import styles from "./ModalProvider.module.scss";
import {modalsPull} from "./modalsPull.ts";
import cn from "classnames";
import type {Modals, ModalProviderContext, ModalItem, ModalId, ModalData, ModalActions} from "./types.ts";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const stub: ModalProviderContext = {
  addModal: () => 0,
  closeModal: () => 0,
  modals: []
};

const ModalProviderContext = createContext<ModalProviderContext>(stub);

export const useModal = (): ModalProviderContext => useContext(ModalProviderContext);

export const ModalProvider = ({children}: { children: ReactNode }) => {
  const [modals, setModals] = useState<Modals>([]);
  const [parent] = useAutoAnimate({duration: 300, easing: "ease-in-out"});

  const actions: ModalActions = {
    addModal({type, props}: ModalData): ModalId {
      const id: ModalId = getId();

      const modalItem: ModalItem = {id, type, props};

      setModals((prev: Modals): Modals => [...prev, modalItem]);

      return id;
    },
    closeModal(id: ModalId): ModalId {
      setModals((prev: Modals): Modals => prev.filter(({id: modalId}: ModalItem): boolean => modalId !== id));
      return id;
    }
  };

  return (
    <ModalProviderContext.Provider value={{...actions, modals}}>
      {children}
      <div ref={parent} className={cn(styles.modals, modals.length && styles.modals_active)}>
        {modals.map(({id, type, props}: ModalItem) => {
          const Component: (modalItem: ModalItem) => JSX.Element = modalsPull[type];
          return (
            <div key={id} className={styles.modals__modal}>
              <Component id={id} type={type} props={props}/>;
            </div>
          );
        })}
      </div>
    </ModalProviderContext.Provider>
  );
};

let id: ModalId = 0;

function getId(): ModalId {
  return id++;
}