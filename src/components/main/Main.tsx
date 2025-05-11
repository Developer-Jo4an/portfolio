import styles from "./Main.module.scss";
import {JSX, useLayoutEffect} from "react";
import {useLoadAssetToMemory} from "../../hooks/useLoadAssetToMemory.ts";
import {useAppCallbacks} from "../../hooks/useAppCallbacks.ts";
import {copyright} from "./copyright.ts";
import {useModal} from "../../providers/modalProvider/ModalProvider.tsx";

const {preload, games} = copyright;

export const Main = (): JSX.Element => {
  const {loadedAssets, load} = useLoadAssetToMemory();

  const {setState} = useAppCallbacks();

  useLayoutEffect((): void => {
    load(preload);
  }, []);

  return (
    <div className={styles.main}>
      <img className={styles.main__bg} src={loadedAssets.background} alt={""}/>
      <div className={styles.main__content}>
        <div className={styles.main__games}>
          {games.map(({game, image}) => (
            <div key={game} className={styles.main__game} onClick={() => setState(game)}>
              <img src={image} alt={""}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};