import {utils} from "../../../helpers/GameUtils.ts";
import BaseCellItem from "../BaseCellItem";
import {gameFactory} from "../../../helpers/GameFactory.ts";
import {gameTimelineSpaceId} from "../../../../../../constants/puzzleBlock.ts";

export default class Square extends BaseCellItem {
  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {
    const {squareViewId, attachmentGroup, helperName, blockerName, gemName} = data;

    this.willKilled = false;

    this.squareViewId = squareViewId;

    this.attachmentGroup = attachmentGroup;

    this.cell = null;

    this.helperName = helperName;
    this.helper = null;

    this.blockerName = blockerName;
    this.blocker = null;

    this.gemName = gemName;
    this.gem = null;

    this.mode = "standard"; // "standard" | "potentiallyKilled"
  }

  init() {
    const {squareViewId} = this;

    super.init(squareViewId);

    // this.initShadow();

    this.initExtraItems();
  }

  initShadow() {
    const {view} = this;

    const texture = AssetsManager.getAssetFromLib("shadow", "texture");

    const shadow = this.shadow ?? (this.shadow = new PIXI.Sprite(texture));

    shadow.alpha = 0.75;
    shadow.zIndex = -1;
    shadow.anchor.set(0.5, 0.5);
    shadow.scale.set(1);

    const size = utils.getCellSize() * 1.75;

    const scale = Math.max(size / shadow.width / view.scale.x, size / shadow.height / view.scale.y);

    shadow.scale.set(scale);

    view.addChild(shadow);
  }

  initExtraItems() {
    const {id, view: container, helperName, gemName, blockerName} = this;

    const extraItemsData = [ //todo: решить некрасивость
      {name: helperName, type: "helper"}, {name: gemName, type: "gem"}, {name: blockerName, type: "blocker"}
    ];

    extraItemsData.forEach(({name, type}) => {
      if (!name) return;

      const entityData = {id: name, name: `${name}:${id}`, parentSquare: this};

      const factoryName = ({gem: "gem"})[type] ?? name;

      const entity = this[type] = gameFactory.createItem(factoryName, entityData);

      container.addChild(entity.view);
    });
  }

  hideAnimation(extraProps = {}) {
    const {view} = this;

    const tween = gsap.to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut", ...extraProps}).save(gameTimelineSpaceId);

    return new Promise(res => tween.eventCallback("onComplete", () => {
      tween.delete(gameTimelineSpaceId);

      this.eventBus.dispatchEvent({
        type: "target:change",
        changesData: {
          [this.squareViewId]: 1,
          "square-base-multicolor": 1
        }
      });
      res();
    }));
  }

  async removeSomeEntity() {
    const {blocker, gem, helper} = this;

    const allSyncAnimations = [];

    if (blocker) {
      allSyncAnimations.push(blocker.hideAnimation().then(() => blocker.destroy()));

      return Promise.all(allSyncAnimations).then(() => this.willKilled = false);
    }

    if (gem)
      allSyncAnimations.push(gem.hideAnimation().then(() => gem.destroy()));

    if (helper)
      allSyncAnimations.push(helper.makeEffect().then(() => helper.destroy()));

    allSyncAnimations.push(this.hideAnimation());

    return Promise.all(allSyncAnimations).then(() => this.destroy());
  }

  deleteEntity(key) {
    const entity = this[key];

    if (entity) {
      this.view.removeChild(entity.view);
      this[key] = null;
      this[`${key}Name`] = null;
    }
  }

  getAroundSquares(sides = [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const {cell} = this;

    const grid = utils.cellsToGrid();

    if (!cell)
      throw new Error("Сan't get squares around if the square has no parent");

    const {row, column} = cell.getPosById();

    return sides.reduce((acc, side) => {
      const [addedX, addedY] = side;

      const neighboringCell = grid[row + addedY]?.[column + addedX];

      const neighboringSquare = neighboringCell?.getEntity?.("square");

      if (neighboringSquare)
        acc.push(neighboringSquare);

      return acc;
    }, []);
  }

  setMode(mode, extraProps = {}) {
    if (this.mode === mode) return;

    this.mode = mode;

    ({
      standard: () => {
        const {squareViewId} = this;
        this.setTexture(squareViewId);
      },
      potentiallyKilled: () => {
        const {extraTexture} = extraProps;
        this.setTexture(extraTexture);
      }
    })[mode]?.();
  }

  reset(data) {
    super.reset(data);
    this.initProperties(data);
    this.init();
  }

  destroy() {
    const destroyData = [
      {entity: "cell", entityCallback: "removeEntity", entityCallbackArgs: ["square"], remove: () => this.cell = null},
      {entity: "blocker", entityCallback: "destroy", deleteName: "blocker"},
      {entity: "gem", entityCallback: "destroy", deleteName: "gem"},
      {entity: "helper", entityCallback: "destroy", deleteName: "helper"}
    ];

    destroyData.forEach(({entity, entityCallback, entityCallbackArgs, remove, deleteName}) => {
      const entityInstance = this[entity];

      if (entityInstance) {
        entityInstance[entityCallback](...(entityCallbackArgs ?? []));
        remove?.();
        typeof deleteName == "string" && this.deleteEntity(deleteName);
      }
    });

    super.destroy();
  }
}
