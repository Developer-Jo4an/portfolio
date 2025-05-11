import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {eventSubscription} from "../../utils/events/eventSubscription.ts";
import {useCashedBounding} from "../useCashedBounding.ts";

export const useStatsControls = ({eventBus}) => {
  const [stats, setStats] = useState({});
  const statsRefsArray = useRef({});

  const bounding = useCashedBounding({elements: statsRefsArray.current, dependencies: [stats]});

  useEffect(() => {
    if (!eventBus) return;

    const callbacksBus = [
      {
        event: "target:update", callback({targetData}) {
          setStats(prev => ({...prev, ...targetData}));
        }
      },
      {
        event: "additionallyElements:update", callback({additionallyElementsData}) {
          setStats(prev => ({...prev, ...additionallyElementsData}));
        }
      }
    ];

    return eventSubscription({callbacksBus, target: eventBus});
  }, [eventBus]);

  useLayoutEffect(() => {
    if (eventBus)
      eventBus.dispatchEvent({type: "targetBounding:change", bounding});
  }, [eventBus, bounding]);

  return {stats, statsRefsArray};
};
