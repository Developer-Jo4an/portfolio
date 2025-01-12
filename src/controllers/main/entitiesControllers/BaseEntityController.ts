export interface BaseEntityProps {
  eventBus: THREE.EventDispatcher;
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  container: HTMLDivElement,
  canvas: HTMLCanvasElement
}

interface BaseEntityInterface extends BaseEntityProps {
  state: string;

  init(): void;

  setState({state}: { state: string }): void;

  update(deltaTime: number): void;
}

export class BaseEntityController implements BaseEntityInterface {
  eventBus: THREE.EventDispatcher;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  state: string;

  constructor({eventBus, scene, renderer, camera, container, canvas}: BaseEntityProps) {
    this.setState = this.setState.bind(this);

    this.eventBus = eventBus;
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.container = container;
    this.canvas = canvas;

    this.eventBus.addEventListener("state:change", this.setState);
  }

  init(): void {

  }

  setState({state}: { state: string }): void {
    this.state = state;

    this[`${state}Selected`]?.();
  }

  update(deltaTime: number): void {

  }
}
