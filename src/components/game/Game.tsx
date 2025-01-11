import React, {useRef} from "react";
import {useScene} from "../../hooks/useScene.ts";

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const {wrapper} = useScene("game", gameContainerRef.current);

  console.log(wrapper);

  return (
    <div className={"game"}>
      <div ref={gameContainerRef} className={"game__container"}></div>
    </div>
  );
};

export default Game;
