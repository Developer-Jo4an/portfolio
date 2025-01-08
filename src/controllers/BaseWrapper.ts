export class BaseWrapper<ControllerType> {
  container: HTMLDivElement;
  controller: ControllerType;

  constructor(container: HTMLDivElement, controller: ControllerType) {
    this.container = container;
    this.controller = controller;
  }
}
