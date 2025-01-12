import React, {useMemo, useRef} from "react";
import Button from "../baseComponents/button/Button.tsx";
import {StateControls, useStateControls} from "../../hooks/useStateControls.ts";
import {useScene} from "../../hooks/useScene.ts";
import Loader from "../baseComponents/loader/Loader.tsx";

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
  const {setState}: StateControls = useStateControls();

  const {optionsButtons, playButton} = mainMenuCopyright;

  const {wrapper} = useScene({
    container: sceneRef,
    wrapperType: "main",
    stateMachine: {
      init: {availableStates: ["playing"], isDefault: true},
      playing: {availableStates: [""]}
    },
    reducers: {}
  });

  const buttonCallbacks = useMemo(
    (): { [key: string]: () => void } => ({
      settings: (): void => {
        console.log("settings");
      },
      sound: (): void => {
        console.log("sound");
      },
      play: (): void => {
        setState("game");
      }
    }),
    []);

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

      <Loader isVisible={!wrapper}/>
    </div>
  );
};

export default MainMenu;
