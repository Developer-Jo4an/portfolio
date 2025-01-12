import {upperFirstLetter} from "../utils/register.ts";

export type WrapperId = "game" | "main"

const baseWrapperPath: string = "/src/controllers/";

export const createWrapperPath = (wrapperId: WrapperId): string => {
  return `${baseWrapperPath}${wrapperId}/${upperFirstLetter(wrapperId)}Wrapper.ts`;
};
