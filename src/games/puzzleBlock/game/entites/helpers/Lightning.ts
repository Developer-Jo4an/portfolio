import BaseHelper from "./BaseHelper.ts";
import {utils} from "../../helpers/GameUtils.ts";
import {gameFactory} from "../../helpers/GameFactory.ts";
import AssetsManager from "../../../../../utils/loader/plugins/AssetsManager.ts";
import {shuffle} from "gsap/gsap-core";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class Lightning extends BaseHelper {
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

    const texture = AssetsManager.getAssetFromLib("lightning", "texture");

    const sprite = this.view ?? (this.view = new PIXI.Sprite(texture));

    sprite.name = name;
    sprite.anchor.set(0.5, 0.5);
    sprite.alpha = 1;
    sprite.scale.set(1);

    const scale = Math.min(size / sprite.width / parentView.scale.x, size / sprite.height / parentView.scale.y);

    sprite.scale.set(scale);
  }

  async makeEffect() {
    const shuffledAllSquares = shuffle([...gameFactory.getCollectionByType("square")]);

    const necessarySquares = shuffledAllSquares.reduce((acc, square) => {
      if (square.willKilled || !square.cell) return acc;

      const {blocker, gem} = square;

      const [upSquare] = square.getAroundSquares([[0, -1]]);
      const crystal = upSquare?.getEntity?.("crystal");

      if (blocker) return acc;

      const type = gem ? "byGems" : crystal ? "byCrystal" : "byNeighboring";

      const necessaryOrder = ({byGems: 0, byCrystal: 1, byNeighboring: 2})[type];

      const prevSquare = acc[necessaryOrder];

      ({
        byGems() {
          if (!prevSquare)
            acc[necessaryOrder] = square;
        },
        byCrystal() {
          if (!prevSquare)
            acc[necessaryOrder] = square;
        },
        byNeighboring() {
          if (!prevSquare || (square.getAroundSquares().length < prevSquare.getAroundSquares().length))
            acc[necessaryOrder] = square;
        }
      })[type]?.();

      return acc;
    }, new Array(3).fill(null));

    if (!necessarySquares) return;

    const willKilledEntity = necessarySquares.find(Boolean);

    if (!willKilledEntity) return;

    willKilledEntity.willKilled = true;

    return willKilledEntity.removeSomeEntity();
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
      parentSquare.deleteEntity("helper");
      this.parentSquare = null;
    }

    super.destroy();
  }
}
