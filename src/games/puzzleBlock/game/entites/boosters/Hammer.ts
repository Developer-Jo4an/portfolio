import BaseBooster from "./BaseBooster.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class Hammer extends BaseBooster {
  constructor(data, type) {
    super(data, type);

    this.initProperties();
    this.init();
  }

  initProperties() {
  }

  init() {
    const {storage: {mainSceneSettings: {hammer: {size: {width, height}}}}} = this;

    const texture = AssetsManager.getAssetFromLib("hammer", "texture");

    const view = this.view = (this.view ?? new PIXI.Sprite(texture));

    view.name = this.name;

    view.alpha = 1;

    view.anchor.set(0.5, 1);

    const scale = Math.min(width / view.width, height / view.height);

    view.scale.set(scale);
  }

  kickAnimation(side) {
    const {view} = this;

    const kickAnimationTimeline = gsap.timeline({
      onComplete() {
        this.delete(gameTimelineSpaceId);
      }
    }).save(gameTimelineSpaceId);

    let kickResolve;
    let endResolve;

    const kickPromise = new Promise(res => kickResolve = res);
    const endPromise = new Promise(res => endResolve = res);

    kickAnimationTimeline
    .to(view, {alpha: 1, duration: 0.3, ease: "sine.inOut", onComplete: kickResolve})
    // todo: Анимация удара
    .to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut", onComplete: endResolve});

    return {kickPromise, endPromise};
  }

  reset(data) {
    super.reset(data);
    this.init();
  }

  destroy() {
    const {view} = this;

    view.parent.removeChild(view);

    super.destroy();
  }
}
