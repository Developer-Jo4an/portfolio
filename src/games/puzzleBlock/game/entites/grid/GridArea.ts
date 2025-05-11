import BaseEntity from "../base/BaseEntity.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class GridArea extends BaseEntity {

  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {
    this.background = this.background ?? (this.background = Object.assign(new PIXI.Graphics(), {zIndex: -1, alpha: 0}));

    this.background.name = "gridAreaBackground";
  }

  init() {
    this.view = (this.view ?? (this.view = new PIXI.Container()));
    this.view.name = this.name;
    this.view.sortableChildren = true;

    this.background.clear();
  }

  drawBackground() {
    this.background.clear();

    this.view.removeChild(this.background);

    const {
      view: {width, height},
      storage: {mainSceneSettings: {area: {background: {color, borderRadius, offset}}}}
    } = this;

    this.background
    .beginFill(color)
    .drawRoundedRect(0, 0, width + offset * 2, height + offset * 2, borderRadius)
    .endFill();

    this.background.pivot.set(width / 2 + offset, height / 2 + offset);

    this.background.position.set(width / 2, height / 2);

    this.background.scale.set(0.8);

    this.view.addChild(this.background);
  }

  showBackground() {
    this.drawBackground();

    const {background} = this;

    const showTimeline = gsap.timeline().save(gameTimelineSpaceId);

    showTimeline
    .to(background.scale, {x: 1, y: 1, ease: "back.out", duration: 0.5})
    .to(background, {alpha: 1, ease: "sine.inOut", duration: 0.5}, 0);

    const onComplete = res => {
      showTimeline.delete(gameTimelineSpaceId);
      res();
    };

    return new Promise(res => showTimeline.eventCallback("onComplete", () => onComplete(res)));
  }

  addCell(cellView) {
    this.view.addChild(cellView);
  }

  clear() {
    this.view.removeChildren();
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
