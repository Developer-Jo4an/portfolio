export class BaseWrapper<ControllerType> {
  container: HTMLDivElement;
  controller: ControllerType;
  canvas: HTMLCanvasElement;

  constructor(container: HTMLDivElement, controller: ControllerType) {
    this.container = container;
    this.controller = controller;
  }

  addCanvas(): void {
    const canvas: HTMLCanvasElement = this.controller.canvas;
    this.container.appendChild(this.canvas = canvas);
  }
}
