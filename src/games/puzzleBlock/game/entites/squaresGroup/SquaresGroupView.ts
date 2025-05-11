import BaseEntity from "../base/BaseEntity.ts";
import {gameFactory} from "../../helpers/GameFactory.ts";
import {utils} from "../../helpers/GameUtils.ts";
import {gameTimelineSpaceId} from "../../../../../constants/puzzleBlock.ts";

export default class SquaresGroupView extends BaseEntity {

  static breakDraggableStates = ["boosterEffect", "losing", "winning"];

  static relatedBoosters = ["rotation"];

  constructor(data, type) {
    super(data, type);

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.initProperties(data);
    this.init();
  }

  initProperties(data) {
    const {levelData: {value: {availableItems: {square: squareTextures}}}} = this;

    const {shape} = data;

    this.shape = shape;

    this.squares = [];
    this.squaresShadows = [];

    this.isCanDoStep = false;

    this.underCells = [];

    this.selectionScale = {x: 1, y: 1};

    this.isEnding = false;
    this.isDragging = false;

    this.startPosition = null;
    this.movePosition = null;

    this.rotationTimes = 0;

    this.squaresTextureId = squareTextures[Math.floor(Math.random() * squareTextures.length)];

    this.potentiallyKilledSquares = [];
  }

  init() {
    const container = this.view ?? (this.view = new PIXI.Container());

    container.sortableChildren = true;

    container.name = `${this.name}-container`;
    container.alpha = 1;
    container.rotation = 0;
    container.zIndex = 0;
    container.scale.set(1);

    this.initSquares();

    container.pivot.set(container.width / 2, container.height / 2);

    this.initSquaresShadows();
  }

  initSquares() {
    const {id: squareGroupId, shape: {shape}, view: container, squaresTextureId} = this;

    shape.forEach(position => {
      const [xNormalized, yNormalized] = position.split("-").map(Number);

      const id = `${xNormalized}-${yNormalized}`;

      const [helperName, gemName, blockerName] = ["helper", "gem", "blocker"].map(name => this.getRandomEntity(name));

      const square = gameFactory.createItem("square", {
        id, squareViewId: squaresTextureId, attachmentGroup: squareGroupId, helperName, gemName, blockerName
      });

      this.squares.push(square);

      const size = utils.getCellSize();

      square.view.position.set(...[yNormalized, xNormalized].map(axis => axis * size + size / 2));

      container.addChild(square.view);
    });
  }

  initSquaresShadows() {
    const {view} = this;

    this.squares.forEach(square => {
      const {width, height, x, y} = square.view;

      const shadow = gameFactory.createItem("shadow", {
        parent: view, bounding: {width: width * 1.75, height: height * 1.75}, id: square.id
      });

      shadow.view.position.set(x, y);

      view.addChild(shadow.view);

      this.squaresShadows.push(shadow);
    });
  }

  getRandomEntity(type) {
    const {storage: {mainSceneSettings: {chances}}, levelData: {value: {availableItems}}} = this;

    const {arr, chance} = {arr: availableItems[type], chance: chances[type]};

    if (!Array.isArray(arr) || typeof chance !== "number" || Math.random() > chance) return null;

    return arr[Math.floor(Math.random() * arr.length)];
  }

  onStateChanged(state) {
    if (SquaresGroupView.breakDraggableStates.includes(state) && this.isDragging)
      this.closeDraggable(true);
  }

  setSelectionScale(scale) {
    this.selectionScale = scale;
    this.view.scale.set(this.selectionScale);
  }

  setInteractive(isInteractive) {
    this.view.interactive = isInteractive;

    const method = isInteractive ? "on" : "off";

    this.view[method]("pointerdown", this.onStart);
    this.view[method]("pointermove", this.onMove);
    this.view[method]("pointerup", this.onEnd);
    this.view[method]("pointerupoutside", this.onEnd);
  }

  onStart({data: {global: {x, y}}}) {
    if (
      this.isEnding ||
      SquaresGroupView.breakDraggableStates.includes(this.state) ||
      SquaresGroupView.relatedBoosters.includes(this.activeBooster.value)
    ) return;

    this.isDragging = true;
    this.setActive(true);
    this.startPosition = {x: this.view.x, y: this.view.y};
    this.movePosition = {x, y};
  }

  onMove({data: {global: {x, y}}}) {
    if (!this.isDragging) return;

    const [xDiff, yDiff] = [x - this.movePosition.x, y - this.movePosition.y].map(diff => diff / this.stage.scale.x);
    this.movePosition = {x, y};
    this.view.position.set(this.view.x + xDiff, this.view.y + yDiff);
    this.setPossibleStepModeToCell([]);
    this.checkCorrectStep();
    this.setPossibleStepModeToCell(this.underCells);
  }

  onEnd() {
    if (!this.isDragging) return;

    this.closeDraggable();

    this[`${this.isCanDoStep ? "doStep" : "setInactive"}`]();
  }

  closeDraggable(toInactive) {
    this.isEnding = true;
    this.isDragging = false;
    toInactive && this.setInactive();
  }

  clearDraggingData() {
    this.isEnding = false;
    this.startPosition = null;
    this.movePosition = null;
  }

  doStep() {
    this.setPossibleStepModeToCell([]);

    this.underCells.forEach((cell, index) => cell.addEntity("square", this.squares[index]));

    this.isCanDoStep = false;

    this.underCells = [];

    this.squares = [];

    this.potentiallyKilledSquares = this.potentiallyKilledSquares.reduce((acc, square) => {
      square.squareViewId = this.squaresTextureId;
      square.setMode("standard");
      return acc;
    }, []);

    this.destroy();

    this.eventBus.dispatchEvent({type: "step:stepped"});
  }

  setInactive() {
    const {view, startPosition: {x, y}} = this;

    const scaleTweenPromise = this.setActive(false);

    const positionTweenPromise = new Promise(res =>
      gsap.to(view, {
        x, y, duration: 0.2, ease: "sine.inOut",
        onComplete: function () {
          this.delete(gameTimelineSpaceId);
          res();
        }
      }).save(gameTimelineSpaceId));

    Promise.all([scaleTweenPromise, positionTweenPromise]).then(() => this.clearDraggingData());
  }

  setActive(isActive) {
    const {view, selectionScale} = this;

    const activeTween = gsap
    .to(view.scale, {
      onStart: () => {
        view.zIndex = +isActive;
      },
      x: isActive ? 1 : selectionScale, y: isActive ? 1 : selectionScale, duration: 0.1, ease: "sine.inOut"
    })
    .save(gameTimelineSpaceId);

    const shadowsAnimations = this.squaresShadows.map(shadow => shadow.setMode(isActive ? "hide" : "visible"));

    const onComplete = res => {
      activeTween.delete(gameTimelineSpaceId);
      view.zIndex = +isActive;
      res();
    };

    return Promise.all([
      new Promise(res => activeTween.eventCallback("onComplete", () => onComplete(res))),
      ...shadowsAnimations
    ]);
  }

  setPossibleStepModeToCell(possibleCells) {
    const cells = gameFactory.getCollectionByType("cell");

    cells.forEach(cell => {
      const isPossible = possibleCells.includes(cell);
      cell.setMode(isPossible ? "possibleStep" : "standard");
    });

    this.potentiallyKilledSquares = this.potentiallyKilledSquares.reduce((acc, square) => {
      square.setMode("standard");
      return acc;
    }, []);

    this.potentiallyKilledSquares = utils.checkOnAddPoints(this.underCells);

    this.potentiallyKilledSquares.forEach(square => {
      square.setMode("potentiallyKilled", {extraTexture: this.squaresTextureId});
    });
  }

  checkCorrectStep() {
    const cells = gameFactory.getCollectionByType("cell");

    const underCells = this.squares.reduce((acc, square) => {
      const squarePosition = square.view.getGlobalPosition();

      const underCell = cells.find(cell => {
        const cellPosition = cell.view.getGlobalPosition();

        const [distanceX, distanceY] = ["x", "y"].map(axis =>
          Math.abs(cellPosition[axis] - squarePosition[axis]) / this.stage.scale[axis]
        );

        return distanceX <= cell.view.width / 2 && distanceY <= cell.view.height / 2;
      });

      return (!underCell || !!underCell.getEntity("square") || underCell.getEntity("crystal")) ? acc : [...acc, underCell];
    }, []);

    this.isCanDoStep = underCells.length === this.squares.length;

    this.underCells = this.isCanDoStep ? underCells : [];
  }

  showAnimation() {
    const {view, view: {scale: {x, y}}} = this;

    const timeline = gsap.timeline().save(gameTimelineSpaceId);

    timeline
    .to(view, {alpha: 1, duration: 0.2, ease: "sine.inOut"})
    .to(view.scale, {x: x * 1.3, y: y * 1.3, duration: 0.2, ease: "sine.inOut"}, 0)
    .to(view.scale, {x, y, duration: 0.3, ease: "sine.inOut"});

    return new Promise(res => timeline.eventCallback("onComplete", () => {
      timeline.delete(gameTimelineSpaceId);
      res();
    }));
  }

  rotationAnimation(extraProps = {}) {
    const {view, view: {rotation}} = this;

    this.rotationTimes++;

    const tween = gsap.to(view, {
      rotation: rotation + Math.PI / 2, duration: 0.3, ease: "sine.out", ...extraProps
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
    this.squaresShadows.forEach(shadow => shadow.destroy());
    this.squaresShadows = [];

    this.setInteractive(false);

    super.destroy();
  }
}
