import {useEffect} from "react";
import {eventSubscription} from "../../utils/events/eventSubscription.ts";

export const useReactionsOnEventBusActions = ({wrapper, state, nextStateCallback, setStateCallback}) => {

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    const callbacksBus = [
      {event: "state:next", callback: nextStateCallback},
      {event: "state:change", callback: ({newState}) => setStateCallback(newState)}
    ];

    return eventSubscription({callbacksBus, target: eventBus});
  }, [wrapper, state]);
};
