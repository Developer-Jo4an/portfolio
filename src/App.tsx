import {ModalProvider} from "./providers/modalProvider/ModalProvider.tsx";
import {applicationStore} from "./stateManager/application.ts";
import {components} from "./constants/components.ts";
import styles from "./styles/index.module.scss";
import {useGreeting} from "./hooks/useGreeting.ts";
import {useAutoAnimate} from "@formkit/auto-animate/react";

export const App = () => {
  const {state} = applicationStore();
  const [parent] = useAutoAnimate({duration: 300, easing: "ease-in-out"});

  const Component = components[state];

  useGreeting();

  return (
    <ModalProvider>
      <div className={styles.applicationWrapper}>
        <div ref={parent} className={styles.applicationContainer}>
          <Component/>
        </div>
      </div>
    </ModalProvider>
  );
};