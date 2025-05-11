import {useBoostersControls} from "../../../hooks/game/useBoostersControls.js";
import cn from "classnames";
import styles from "./Boosters.module.scss";

export const Boosters = ({eventBus, state}) => {
  const {boosters, activeBooster, isAvailableClick, actions} = useBoostersControls({eventBus, state});

  return (
    <div className={styles.boosters}>
      {Object.keys(boosters).map(name => (
        <div
          key={name}
          className={cn(styles.boosters__item, {[styles.boosters__item_active]: activeBooster === name})}
          onClick={() => isAvailableClick && actions.toggle({boosterName: name, eventBus})}
        >
          <img src={`/icons/game/boosters/${name}.svg`} className={styles.boosters__itemImage} alt={""}/>
        </div>
      ))}
    </div>
  );
};
