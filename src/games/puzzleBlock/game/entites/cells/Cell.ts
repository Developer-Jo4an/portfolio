import BaseEntity from "../base/BaseEntity.ts";
import {utils} from "../../helpers/GameUtils.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class Cell extends BaseEntity {

  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties() {
    this.mode = "standard";
    this.square = null;
    this.crystal = null;
  }

  init() {
    const spriteTexture = AssetsManager.getAssetFromLib("cell", "texture");

    const size = utils.getCellSize();

    const cellSprite = this.cellSprite ?? (this.cellSprite = new PIXI.Sprite());
    cellSprite.texture = spriteTexture;
    cellSprite.scale.set(1);
    cellSprite.scale.set(size / cellSprite.width, size / cellSprite.height);

    cellSprite.name = `${this.name}-sprite`;
    cellSprite.alpha = 1;

    const container = this.view ?? (this.view = new PIXI.Container());

    container.removeChildren();

    container.zIndex = 0;
    container.name = this.name;
    container.alpha = 1;
    container.addChild(cellSprite);
    container.pivot.set(cellSprite.width / 2, cellSprite.height / 2);
  }

  addEntity(type, entity) {
    const {id} = this;

    this[type] = entity;

    entity.id = id;
    entity.name = `${type}:${entity.id}`;
    entity.view.name = `${type}:${entity.id}-sprite`;
    entity.view.position.set(entity.view.width / 2, entity.view.height / 2);

    this.view.addChild(entity.view);

    entity.cell = this;
  }

  getEntity(type) {
    return this[type];
  }

  removeEntity(type) {
    if (!this[type]) return;

    this.view.removeChild(this[type].view);
    this[type] = null;
  }

  setMode(mode) {
    const {cell: {mods: {standard, possibleStep}}} = this.storage.mainSceneSettings;

    this.mode = mode;

    ({
      standard: () => this.cellSprite.tint = standard.color,
      possibleStep: () => this.cellSprite.tint = possibleStep.color
    })[mode]();
  }

  showAnimation(extraProps = {}) {
    const {view} = this;

    const tween = gsap.to(view.scale, {
      x: 1, y: 1, duration: 0.2, ease: "ease.inOut", ...extraProps
    }).save(gameTimelineSpaceId);

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
    ["square", "crystal"].forEach(type => {
      const entity = this.getEntity(type);

      if (entity) {
        entity.destroy();
        this.removeEntity(type);
      }
    });

    super.destroy();
  }
}
