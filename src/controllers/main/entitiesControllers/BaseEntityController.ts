interface BaseEntityInterface {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;

  init(): void;

  update(deltaTime: number): void;
}

export interface BaseEntityProps {
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  container: HTMLDivElement,
  canvas: HTMLCanvasElement
}

export class BaseEntityController implements BaseEntityInterface {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;

  constructor({scene, container, canvas, renderer, camera}: BaseEntityProps) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.container = container;
    this.canvas = canvas;
  }

  init(): void {

  }

  update(deltaTime: number): void {

  }
}
