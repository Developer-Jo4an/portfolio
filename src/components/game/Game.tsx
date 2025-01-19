import React, {useRef} from "react";
import {useScene} from "../../hooks/useScene.ts";

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const {wrapper} = useScene({
    container: gameContainerRef,
    wrapperType: "game",
    stateMachine: {
      init: {availableStates: ["playing"], isDefault: true},
      playing: {availableStates: [""]}
    },
    reducers: {}
  });

  return (
    <div className={"game"}>
      <div ref={gameContainerRef} className={"game__container"}/>
    </div>
  );
};

export default Game;
