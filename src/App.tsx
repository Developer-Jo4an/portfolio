import {applicationStore} from "./stateManager/application.ts";
import {components} from "./constants/components.ts";
import styles from "./styles/index.module.scss";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {CombineProviders} from "./providers/CombineProviders.tsx";

export const App = () => {
  const {state} = applicationStore();

  const [parent] = useAutoAnimate({duration: 300, easing: "ease-in-out"});

  const Component = components[state];

  return (
    <CombineProviders>
      <div className={styles.applicationWrapper}>
        <div ref={parent} className={styles.applicationContainer}>
          <Component/>
        </div>
      </div>
    </CombineProviders>
  );
};