import BaseEntity from "../base/BaseEntity.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class BaseShadow extends BaseEntity {
  constructor(data, type) {
    super(data, type);
  }

  initProperties(data) {
    this.parent = data.parent;
    this.bounding = data.bounding;
  }

  init() {
    const {bounding: {width, height}} = this;

    const texture = AssetsManager.getAssetFromLib("shadow", "texture");

    const view = this.view ?? (this.view = new PIXI.Sprite(texture));

    view.name = "shadow";

    view.anchor.set(0.5, 0.5);
    view.scale.set(1);
    const scale = Math.max(width / view.width, height / view.height);
    view.scale.set(scale);
    view.zIndex = -1;

    this.setMode("visible", {immediate: true});
  }

  setMode(mode, {immediate = false, ...extraProps} = {}) {
    if (this.mode === mode) return;

    this.mode = mode;

    const {view} = this;

    this.stopModeTweens();

    return ({
      visible: () => {
        if (immediate) {
          view.alpha = 0.75;
          return;
        }

        return new Promise(res => {
          const tween = gsap.to(view, {
            alpha: 0.75, ease: "sine.out", duration: 0.3, ...extraProps,
            onComplete: () => {
              tween.delete(gameTimelineSpaceId);
              res();
            }
          }).save(gameTimelineSpaceId, "shadowVisibleTween");
        });
      },
      hide: () => {
        if (immediate) {
          view.alpha = 0;
          return;
        }

        return new Promise(res => {
          const tween = gsap.to(view, {
            alpha: 0, ease: "sine.out", duration: 0.3, ...extraProps,
            onComplete: () => {
              tween.delete(gameTimelineSpaceId);
              res();
            }
          }).save(gameTimelineSpaceId, "shadowHideTween");
        });
      }
    })[mode]?.();
  }

  stopModeTweens() {
    ["shadowVisibleTween", "shadowHideTween"].forEach(tweenId => {
      gsap.localTimeline.discontinue(gameTimelineSpaceId, tweenId, true, true);
    });
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    const {parent} = this;

    parent.removeChild(this.view);

    this.stopModeTweens();

    super.destroy();
  }
}
