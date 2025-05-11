import BaseEntity from "../base/BaseEntity.ts";
import {utils} from "../../helpers/GameUtils.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";

export default class BaseCellItem extends BaseEntity {
  constructor(data, type) {
    super(data, type);
  }

  init(textureName) {
    if (!textureName)
      throw new Error("textureName in not defined");

    const sprite = this.view ?? (this.view = new PIXI.Sprite());

    this.setTexture(textureName);

    const size = utils.getCellSize();

    sprite.scale.set(1);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(size / sprite.width, size / sprite.height);
    sprite.position.set(sprite.width / 2, sprite.height / 2);
    sprite.name = `${this.name}-sprite`;
    sprite.alpha = 1;
    sprite.zIndex = 0;
  }

  setTexture(textureName) {
    this.view.texture = AssetsManager.getAssetFromLib(textureName, "texture");
  }

  showAnimation() {

  }

  hideAnimation() {

  }
}
