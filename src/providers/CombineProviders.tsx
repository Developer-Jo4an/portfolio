import type {ReactNode} from "react";
import {ModalProvider} from "./modalProvider/ModalProvider.tsx";

export const CombineProviders = ({children}: { children: ReactNode }) => {
  return (
    <ModalProvider>
      {children}
    </ModalProvider>
  )
};