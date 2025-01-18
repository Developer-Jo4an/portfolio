interface BaseControllerInterface {
  eventBus: THREE.EventDispatcher;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  state: string;

  init(): void;

  setEventBus(eventBus: THREE.EventDispatcher): void;

  setState({state}: { state: string }): void;

  update(deltaTime: number): void;

  resize(): void;
}

export class BaseController implements BaseControllerInterface {

  public static preloadId: string = "none";

  protected eventBus: THREE.EventDispatcher;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected canvas: HTMLCanvasElement;
  protected container: HTMLDivElement;
  protected state: string;

  constructor(container: HTMLDivElement) {
    this.resize = this.resize.bind(this);
    this.setState = this.setState.bind(this);
    this.update = this.update.bind(this);

    this.container = container;
  }

  public init(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvas = this.renderer.domElement;

    window.addEventListener("resize", this.resize);

    this.container.appendChild(this.canvas);

    this.resize();
  }

  public setEventBus(eventBus: THREE.EventDispatcher): void {
    this.eventBus = eventBus;

    this.eventBus.addEventListener("state:change", this.setState);
  }

  private setState({state}): void {
    this.state = state;

    this[`${state}Selected`]?.();
  }

  protected update(deltaTime: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const {clientWidth, clientHeight}: { clientWidth: number, clientHeight: number } = this.container;

    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.canvas.style.width = `width: ${clientWidth}px`;
    this.canvas.style.height = `height: ${clientHeight}px`;

    this.renderer.setSize(clientWidth, clientHeight);

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
  }

  reset(): void {
    //todo: reset
  }
}
