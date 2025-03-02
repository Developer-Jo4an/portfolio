import {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "./store.ts";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export interface AppCallbacks {
  [propName: string]: (...props: any[]) => void;
}

export const useAppCallbacks = (): AppCallbacks => {
  const dispatch = useAppDispatch();

  return useMemo((): AppCallbacks => {
    return {

    };
  }, []);
};
