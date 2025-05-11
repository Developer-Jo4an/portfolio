import {useEffect, useState} from "react";

export const useCashedBounding = ({elements, dependencies}) => {
  const [bounding, setBounding] = useState({});

  useEffect(() => {
    const onResize = () => {
      const boundingData = {};
      for (const key in elements)
        boundingData[key] = elements[key].getBoundingClientRect();
      setBounding(boundingData);
    };
    onResize();
    window?.addEventListener("resize", onResize);
    return () => window?.removeEventListener("resize", onResize);
  }, dependencies);

  return bounding;
};
