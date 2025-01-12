import {PreloadData, preloadData} from "./preload.ts";
import {AssetsManager} from "./AssetsManager.ts";
import {WrapperId} from "./config.ts";

type ConstructorType<ControllerType> = {
  preloadId: string;
  new(container: HTMLDivElement): InstanceType<ControllerType>;
}

export class BaseWrapper<ControllerType extends ConstructorType<ControllerType>> {

  static id: WrapperId;

  public eventBus: THREE.EventDispatcher;
  readonly container: HTMLDivElement;
  readonly ControllerClass: ControllerType;
  private controller: InstanceType<ControllerType>;

  constructor({container, Class}: { container: HTMLDivElement; Class: ControllerType }) {
    this.eventBus = new THREE.EventDispatcher();
    this.container = container;
    this.ControllerClass = Class;
  }

  public async initController(): Promise<void> {
    const preloadType: string = this.ControllerClass.preloadId;

    if (preloadData.hasOwnProperty(preloadType)) {
      const data: PreloadData[] = preloadData[preloadType];

      AssetsManager.createLoaders(data);

      await Promise.all(data.map((obj: PreloadData) => AssetsManager.loadEntity(obj)));
    }

    this.controller = new this.ControllerClass(this.container);

    this.controller.setEventBus(this.eventBus);

    this.controller.init();
  }

  public reset(): void {
    this.controller.reset();
  }
}
