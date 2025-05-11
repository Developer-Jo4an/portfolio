import {baseLevel, gameTimelineSpaceId, ignoreNextState, stateMachine} from "../../constants/puzzleBlock.ts";
import {JSX, useRef, useState} from "react";
import {useGameStateControls} from "../../hooks/game/useGameStateControls.ts";
import {useGameReducers} from "../../hooks/game/useGameReducers.ts";
import useStateReducer from "../../hooks/game/useStateReducer.ts";
import {useLoadController} from "../../hooks/game/useLoadController.ts";
import {copy} from "../../utils/object/copy.ts";
import {useReactionsOnEventBusActions} from "../../hooks/game/useReactionsOnEventBusActions.ts";
import {useDestroyGame} from "../../hooks/game/useDestroyGame.ts";
import {Boosters} from "./boosters/Boosters.tsx";
import {Stats} from "./stats/Stats.tsx";
import {gamePixiImports} from "../../utils/imports/pixiGame/gamePixiImport.ts";
import styles from "./PuzzleBlock.module.scss";

export const PuzzleBlock = (): JSX.Element => {
  const [wrapper, setWrapper] = useState();
  const [state, setState] = useState(Object.entries(stateMachine).find(([_, value]) => value.isDefault)?.[0]);
  const containerRef = useRef(null);

  const {setStateCallback, nextStateCallback} = useGameStateControls({stateMachine, state, setState});

  const reducers = useGameReducers({setState});

  useStateReducer(reducers, ignoreNextState, nextStateCallback, state, wrapper);

  useLoadController({
    getWrapperPromise: () => import("../../games/puzzleBlock/game/GameWrapper.ts"),
    getLibsPromise: () => gamePixiImports(gameTimelineSpaceId),
    beforeInit: ({wrapper}) => {
      setWrapper(wrapper);
    },
    afterInit: ({wrapper}) => {
      wrapper.setLevelData(copy(baseLevel));
      wrapper.appendContainer(containerRef.current);
    }
  });

  useReactionsOnEventBusActions({wrapper, state, nextStateCallback, setStateCallback});

  useDestroyGame({wrapper});

  return (
    <div className={styles.game}>
      <div className={styles.game__wrapper}>
        <div className={styles.game__container} ref={containerRef}/>
        <Boosters eventBus={wrapper?.eventBus} state={state}/>
        <Stats eventBus={wrapper?.eventBus}/>
      </div>
    </div>
  );
};