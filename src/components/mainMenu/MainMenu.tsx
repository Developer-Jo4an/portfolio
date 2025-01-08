import React, {useEffect, useMemo, useRef} from "react";
import Button from "../baseComponents/button/Button.tsx";
import {useScene} from "../../hooks/useScene.ts";

const mainMenuCopyright = {
  optionsButtons: [
    {
      img: "/images/settings-button.png",
      alt: "settings",
      action: "settings"
    },
    {
      img: "/images/settings-button.png",
      alt: "settings",
      action: "sound"
    }
  ],
  playButton: {
    img: "/images/main-button.png",
    alt: "play",
    action: "play"
  }
};

const MainMenu = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const {optionsButtons, playButton} = mainMenuCopyright;

  const buttonCallbacks = useMemo(
    (): { [key: string]: () => void } => ({
      settings: () => {
        console.log("settings");
      },
      sound: () => {
        console.log("sound");
      },
      play: () => {
        console.log("play");
      }
    }),
    []);

  useEffect((): void => {

  }, []);

  useScene("main", sceneRef.current)

  return (
    <div className={"main-menu"}>
      <div className={"main-menu__scene-wrapper"} ref={sceneRef}/>
      <div className={"main-menu__options-buttons"}>
        {optionsButtons.map(button => (
          <Button
            key={button.action}
            className={"main-menu__option-button"}
            onClick={buttonCallbacks[button.action]}
          >
            <img src={button.img} alt={button.alt}/>
          </Button>
        ))}
      </div>
      <Button
        className={"main-menu__play-button"}
        onClick={buttonCallbacks[playButton.action]}
      >
        <img src={playButton.img} alt={playButton.alt}/>
      </Button>
    </div>
  );
};

export default MainMenu;
