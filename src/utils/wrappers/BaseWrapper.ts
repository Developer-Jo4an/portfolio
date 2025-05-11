
import State from "../decorators/state/State.ts";
import {EventDispatcher} from "../events/EventDispatcher.ts";
import SceneController from "../containers/SceneController.ts";
import {CustomData} from "../data/CustomData.ts";
import CanvasResize from "../decorators/resize/CanvasResize.ts";

export default class BaseWrapper {

  decorators = [State, CanvasResize];

  eventBus = new EventDispatcher();

  storage = new CustomData();

  readyPromise;

  readyResolver;

  loadingPromise;

  loadingResolver;


  constructor() {

    this.onLoad = this.onLoad.bind(this);

    this.readyPromise = new Promise(resolve => this.readyResolver = resolve);
    this.loadingPromise = new Promise(resolve => this.loadingResolver = resolve);

    this.eventBus.addEventListener("scene-controller:loaded", this.onLoad);
  }

  init() {
    if (this.controller) return;

    this.controller = this.initController();

    this.decorators.forEach((Decorator) => new Decorator(this));
    this.readyResolver({
      events: this.eventBus
    });

    this.controller.init();
  }

  onLoad() {
    this.loadingResolver();
  }

  appendContainer(container) {
    this.controller.appendContainer?.(container);
  }

  initController() {
    const {eventBus, storage} = this;

    return new SceneController({eventBus, storage});
  }
}
