import {useAppCallbacks, useAppSelector} from "../../stateManager/stateManagerHooks.ts";
import {useAppSliceData} from "../../stateManager/slices/appSlice.ts";
import {statesComponents} from "../../stateMachine/stateMachine.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect} from "react";

interface StateCallbacks {
  [propName: string]: () => void;
}

const App = () => {
  const {state} = useAppSelector(useAppSliceData);
  const ActiveComponent = statesComponents[state];
  const appCallbacks = useAppCallbacks();

  useEffect((): void => {
    const stateCallbacks: StateCallbacks = {
      mainMenu: () => {

      },
      game: () => {

      }
    };

    stateCallbacks[state]?.();
  }, [state]);

  return (
    <div className={"app"}>
      <AnimatePresence mode={"wait"}>
        <motion.div
          key={ActiveComponent}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          initial={{opacity: 0}}
          transition={{duration: 0.5}}
        >
          <ActiveComponent/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
