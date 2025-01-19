interface BaseControllerInterface<ControllerType> {
  eventBus: THREE.EventDispatcher;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  state: string;
  controllers: ControllerType[]

  init(): void;

  setEventBus(eventBus: THREE.EventDispatcher): void;

  setState({state}: { state: string }): void;

  update(deltaTime: number): void;

  resize(): void;

  reset(): void;
}

export class BaseController<ControllerType> implements BaseControllerInterface<ControllerType> {

  public static preloadId: string = "none";

  readonly static MAX_MS: number = 35;

  protected eventBus: THREE.EventDispatcher;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected renderer: THREE.WebGLRenderer;
  protected canvas: HTMLCanvasElement;
  protected container: HTMLDivElement;
  protected state: string;
  protected controllers: ControllerType[]

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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    if (this.renderer)
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
    try {
      this.scene.traverse(obj => {
        if (obj === this.scene || obj?.isNotDestroyed) return;

        if (obj.material) {
          if (Array.isArray(obj.material))
            obj.material.forEach(material => material.dispose());
          else
            obj.material.dispose();
        }

        if (obj.geometry)
          obj.geometry.dispose();

        this.scene.remove(obj);
      });
    } catch (e) {
    }
  }
}
