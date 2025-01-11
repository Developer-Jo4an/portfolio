export class BaseWrapper<ControllerType> {
  eventBus: THREE.EventDispatcher;
  container: HTMLDivElement;
  controller: ControllerType;

  constructor(container: HTMLDivElement, controller: ControllerType) {
    this.eventBus = new THREE.EventDispatcher();
    this.container = container;
    this.controller = controller;
    this.controller.eventBus = this.eventBus;
  }

  reset(): void {
    this.controller.reset();
  }
}
