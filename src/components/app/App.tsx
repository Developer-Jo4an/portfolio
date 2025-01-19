import {useAppSelector} from "../../stateManager/stateManagerHooks.ts";
import {InitialAppState, useAppSliceData} from "../../stateManager/slices/appSlice.ts";
import {statesComponents} from "../../stateMachine/stateMachine.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {useStateCallback} from "../../hooks/useStateCallback.ts";
import * as React from "react";

const App = () => {
  const {state}: InitialAppState = useAppSelector(useAppSliceData);
  const ActiveComponent: React.FC = statesComponents[state];

  const necessaryCallback = useStateCallback();

  const stateEnter = ({opacity: onEnter}: { opacity: number }): void => {
    onEnter && necessaryCallback?.();
  };

  return (
    <div className={"app"}>
      <AnimatePresence mode={"wait"}>
        <motion.div
          key={state}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          initial={{opacity: 0}}
          transition={{duration: 0.5}}
          onAnimationStart={stateEnter}
        >
          <ActiveComponent/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
