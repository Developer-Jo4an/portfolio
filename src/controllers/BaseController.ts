import {PreloadData, preloadData} from "./main/preload.ts";
import {AssetsManager} from "./AssetsManager.ts";

export interface BaseControllerInterface {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;

  init(): Promise<void>;

  update(deltaTime: number): void;

  resize(): void;
}

export class BaseController implements BaseControllerInterface {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.resize = this.resize.bind(this);
    this.update = this.update.bind(this);

    this.container = container;

    this.init();
  }

  async init(): Promise<void> {
    AssetsManager.createLoaders(preloadData);

    await Promise.all(preloadData.map((obj: PreloadData) => AssetsManager.loadEntity(obj)));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.canvas = this.renderer.domElement;

    window.addEventListener("resize", this.resize);

    this.resize();

    this.container.appendChild(this.canvas);
  }

  update(deltaTime: number): void {
    this.renderer.render(this.scene, this.camera);
  };

  resize(): void {
    const {clientWidth, clientHeight}: { clientWidth: number, clientHeight: number } = this.container;

    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.canvas.style.width = `width: ${clientWidth}px`;
    this.canvas.style.height = `height: ${clientHeight}px`;

    this.renderer.setSize(clientWidth, clientHeight);
  };
}
