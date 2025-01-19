import React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
}

const Loader = ({isVisible}: LoaderProps) => {
  return (
    <AnimatePresence>
      {isVisible && <motion.div
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        initial={{opacity: 0}}
        transition={{duration: 0.5}}
      >
        <div className={"loader"}>
          <span className={"loader__spinner"}></span>
        </div>
      </motion.div>}
    </AnimatePresence>
  );
};

export default Loader;
