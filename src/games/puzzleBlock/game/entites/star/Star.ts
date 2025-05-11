import BaseStar from "./BaseStar.ts";
import {utils} from "../../helpers/GameUtils.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class Star extends BaseStar {
  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {

  }

  init() {
    const {name} = this;

    const size = utils.getCellSize();

    const texture = AssetsManager.getAssetFromLib("star", "texture");

    const sprite = this.view ?? (this.view = new PIXI.Sprite());

    sprite.texture = texture;

    sprite.name = name;
    sprite.anchor.set(0.5, 0.5);
    sprite.alpha = 1;
    sprite.scale.set(1);

    const scale = Math.min(size / sprite.width, size / sprite.height);

    sprite.scale.set(scale);
  }

  showAnimation() {
    const {view} = this;

    view.alpha = 0;

    const showTimeline = gsap.timeline().save(gameTimelineSpaceId);

    showTimeline
    .to(view, {
      alpha: 1, duration: 0.3, ease: "sine.inOut"
    })
    .to(view.scale, {
      x: view.scale.x * 1.2, y: view.scale.y * 1.2, duration: 0.3, ease: "sine.inOut", repeat: 2, yoyo: true
    })
    .to(view, {
      alpha: 0, duration: 0.3, ease: "sine.inOut"
    });

    const onComplete = res => {
      showTimeline.delete(gameTimelineSpaceId);
      this.eventBus.dispatchEvent({type: "additionallyChange:change", changesData: {star: 1}});
      res();
    };

    return new Promise(res => showTimeline.eventCallback("onComplete", () => onComplete(res)));
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    super.destroy();
  }
}
