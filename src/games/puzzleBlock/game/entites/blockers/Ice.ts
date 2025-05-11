import BaseBlocker from "./BaseBlocker.ts";
import {utils} from "../../helpers/GameUtils.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class Ice extends BaseBlocker {
  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {
    this.parentSquare = data.parentSquare;
  }

  init() {
    const {name, parentSquare: {view: parentView}} = this;

    const size = utils.getCellSize();

    const texture = AssetsManager.getAssetFromLib("ice", "texture");

    const sprite = this.view ?? (this.view = new PIXI.Sprite(texture));

    sprite.name = name;
    sprite.anchor.set(0.5, 0.5);
    sprite.alpha = 0.8;
    sprite.scale.set(1);

    const scale = Math.min(size / sprite.width / parentView.scale.x, size / sprite.height / parentView.scale.y);

    sprite.scale.set(scale);
  }

  hideAnimation(extraProps = {}) {
    const {view} = this;

    const tween = gsap.to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut", ...extraProps}).save(gameTimelineSpaceId);

    return new Promise(res => tween.eventCallback("onComplete", () => {
      tween.delete(gameTimelineSpaceId);
      res();
    }));
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    const {parentSquare} = this;

    if (parentSquare) {
      parentSquare.deleteEntity("blocker");
      this.parentSquare = null;
    }

    super.destroy();
  }
}
