import {useEffect} from "react";

export const useDestroyGame = ({wrapper}) => {
  useEffect(() => () => wrapper?.destroy?.(), [wrapper]);
};
