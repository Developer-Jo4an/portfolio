import {useEffect, useReducer} from "react";
import {stateMachine} from "../../constants/puzzleBlock.ts";
import {boostersCopyright} from "../../components/puzzleBlock/boosters/copyright.ts";
import {eventSubscription} from "../../utils/events/eventSubscription.ts";

const {boostersList} = boostersCopyright;

const initialState = {
  boosters: boostersList.reduce((acc, {name}) => ({...acc, [name]: {isActive: false}}), {})
};

export const useBoostersControls = ({eventBus, state}) => {
  const [boostersData, dispatch] = useReducer(boostersReducer, initialState, state => state);

  const {boosters} = boostersData;

  const actions = {
    uninstall: data => dispatch({type: "boosters:uninstalled", data}),
    toggle: data => dispatch({type: "booster:toggle", data})
  };

  const activeBooster = Object.entries(boosters ?? {}).find(([, data]) => data.isActive)?.[0];

  const isAvailableClick = Object
  .entries(stateMachine)
  .reduce((acc, [stateKey, value]) => value.isEnableBoosters ? [...acc, stateKey] : acc, []).includes(state);

  useEffect(() => {
    if (!eventBus) return;

    const callbacksBus = [
      {event: "boosters:uninstalled", callback: actions.uninstall}
    ];

    return eventSubscription({callbacksBus, target: eventBus});
  }, [eventBus]);

  return {boosters, activeBooster, isAvailableClick, actions};
};


function boostersReducer(state, {type, data}) {
  const modifiedFields = ({
    "boosters:uninstalled"() {
      return {
        boosters: Object.entries(state.boosters).reduce((acc, [name, data]) => ({
          ...acc,
          [name]: {...data, isActive: false}
        }), {})
      };
    },
    "booster:toggle"({boosterName, eventBus}) {
      const boosterData = {booster: boosterName, isActive: null};

      const boosters = Object.entries(state.boosters).reduce((acc, [name, data]) => ({
        ...acc,
        [name]: {...data, isActive: boosterName === name && (boosterData.isActive = !data.isActive)}
      }), {});

      const {booster, isActive} = boosterData;

      eventBus.dispatchEvent({type: "booster:change", booster: isActive ? booster : "reset"});

      return {boosters};
    }
  })[type](data);

  return {...state, ...modifiedFields};
}
