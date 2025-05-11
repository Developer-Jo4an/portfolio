import {useMemo} from "react";
import {applicationStore} from "../stateManager/application.ts";

export const useAppCallbacks = () => {
  const {setState} = applicationStore();

  return useMemo(() => ({setState}), []);
};