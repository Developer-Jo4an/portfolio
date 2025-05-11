import {useStatsControls} from "../../../hooks/game/useStatsControls.ts";
import styles from "./Stats.module.scss";

export const Stats = ({eventBus}) => {
  const {stats, statsRefsArray} = useStatsControls({eventBus});

  return (
    <div className={styles.stats}>
      <div className={styles.stats__container}>
        {Object.entries(stats).map(([name, value]) => (
          <div key={name} className={styles.stats__item}>
            <img
              ref={ref => statsRefsArray.current[name] = ref} src={`/images/game/stats/${name}.png`} alt={""}
              className={styles["stats__item-image"]}
            />
            <span className={styles["stats__item-value"]}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
