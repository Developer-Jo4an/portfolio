import BaseGem from "./BaseGem.ts";
import {utils} from "../../helpers/GameUtils.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";

export default class Gem extends BaseGem {
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

    const texture = AssetsManager.getAssetFromLib(this.id, "texture");

    const sprite = this.view ?? (this.view = new PIXI.Sprite());

    sprite.texture = texture;

    sprite.name = name;
    sprite.anchor.set(0.5, 0.5);
    sprite.alpha = 1;
    sprite.scale.set(1);

    const scale = Math.min(size / sprite.width / parentView.scale.x, size / sprite.height / parentView.scale.y);

    sprite.scale.set(scale);
  }

  hideAnimation(extraProps = {}) {
    const {targetBounding: {bounding}, view: gem} = this;

    // const necessaryTarget = bounding[this.id];

    const {view} = this;

    const tween = gsap.to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut", ...extraProps}).save(gameTimelineSpaceId);

    return new Promise(res => tween.eventCallback("onComplete", () => {
      tween.delete(gameTimelineSpaceId);
      this.eventBus.dispatchEvent({type: "target:change", changesData: {[this.id]: 1}});
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
      parentSquare.deleteEntity("gem");
      this.parentSquare = null;
    }

    super.destroy();
  }
}
