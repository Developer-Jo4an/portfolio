import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {MainFactory} from "../MainFactory.ts";

const PositionOffset = {x: 0, y: 1.5, z: 0};

const PositionVector = {x: 4, y: 3, z: 5};

export class CameraController extends BaseEntityController {

  target: ReturnType<typeof MainFactory.getEntity>;

  flyingProgress: number = 0.25;

  isFlyingCamera: boolean = true;

  controls: THREEAddons.OrbitControls;

  constructor(data: BaseEntityProps) {
    super(data);

    this.setOrbitControls = this.setOrbitControls.bind(this);

    this.init();
  }

  init(): void {
    this.target = MainFactory.getEntity("actor");

    this.controls = new THREEAddons.OrbitControls(this.camera, this.canvas);
    this.controls.maxDistance = 10;
    this.controls.minDistance = 4;
    this.controls.maxPolarAngle = Math.PI / 3;
    this.controls.mouseButtons = {LEFT: THREE.MOUSE.ROTATE};

    this.flying(0);
    this.lookToTarget();

    this.container.addEventListener("mousemove", this.setOrbitControls);
    this.container.addEventListener("touchmove", this.setOrbitControls);
  }

  setOrbitControls(e: MouseEvent | TouchEvent): void {
    if (!this.isFlyingCamera) return;

    const evTypesLogic: { [key: "mousemove" | "touchmove"]: () => boolean } = {
      touchmove: (): boolean => true,
      mousemove: (): boolean => [1].includes((e as MouseEvent).buttons)
    };

    if (!evTypesLogic[e.type]()) return;

    this.isFlyingCamera = false;

    GSAP.killTweensOf(this.camera.position);
  }

  flying(delta: number): void {
    this.flyingProgress = ((): number => {
      const newFlyingProgress: number = this.flyingProgress + (delta / 60000);
      return newFlyingProgress > 1 ? 0 : newFlyingProgress;
    })();

    const position: THREE.Vector3 = this.camera.position;

    const angle: number = this.flyingProgress * (Math.PI * 2);

    const zPosition: number = Math.sin(angle) * PositionVector.z;
    const xPosition: number = Math.cos(angle) * PositionVector.x;

    this.camera.position.set(xPosition, position.y, zPosition);

    if (!GSAP.getTweensOf(position).length) {
      const timeline: ReturnType<typeof GSAP.timeline> = GSAP.timeline({
        repeat: -1,
        onStart: (): void => {
          position.y = PositionVector.y;
        }
      });

      timeline
        .to(position, {
          duration: 3,
          ease: "sine.inOut",
          y: PositionVector.y + 0.5
        })
        .to(position, {
          duration: 6,
          ease: "sine.inOut",
          y: PositionVector.y - 0.5
        })
        .to(position, {
          duration: 3,
          ease: "sine.inOut",
          y: PositionVector.y
        });
    }
  }

  lookToTarget(): void {
    const {x, y, z}: THREE.Vector3 = this.target.position;

    this.camera.lookAt(x + PositionOffset.x, y + PositionOffset.y, z + PositionOffset.z);
  }

  update(deltaTime: number): void {
    this.controls.update();

    this.lookToTarget();

    if (this.isFlyingCamera)
      this.flying(deltaTime);
  }
}
