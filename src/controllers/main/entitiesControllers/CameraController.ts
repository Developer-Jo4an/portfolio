import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";
import {EntityType, MainFactory} from "../MainFactory.ts";
import {Constants} from "../../../constants/scene/constants.ts";

const constants: Constants = {
  lookOffset: {x: 0, y: 3, z: 0},
  flyOffset: {x: 16, y: 8, z: 12.5},
  controls: {
    maxDistance: 22,
    minDistance: 14,
    maxPolarAngle: Math.PI / 3
  }
};

export class CameraController extends BaseEntityController {

  target: EntityType;

  flyingProgress: number = 0.25;

  isFlyingCamera: boolean = true;

  controls: THREEAddons.OrbitControls;

  constructor(data: BaseEntityProps) {
    super(data);

    this.setOrbitControls = this.setOrbitControls.bind(this);

    this.init();
  }

  init(): void {
    const {controls} = constants;

    this.target = MainFactory.getEntity("actor");

    this.controls = new THREEAddons.OrbitControls(this.camera, this.canvas);
    this.controls.maxDistance = controls.maxDistance;
    this.controls.minDistance = controls.minDistance;
    this.controls.maxPolarAngle = controls.maxPolarAngle;
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
    const {flyOffset} = constants;

    this.flyingProgress = ((): number => {
      const newFlyingProgress: number = this.flyingProgress + (delta / 60000);
      return newFlyingProgress > 1 ? 0 : newFlyingProgress;
    })();

    const position: THREE.Vector3 = this.camera.position;

    const angle: number = this.flyingProgress * (Math.PI * 2);

    const zPosition: number = Math.sin(angle) * flyOffset.z;
    const xPosition: number = Math.cos(angle) * flyOffset.x;

    this.camera.position.set(xPosition, position.y, zPosition);

    if (!GSAP.getTweensOf(position).length) {
      const timeline: ReturnType<typeof GSAP.timeline> = GSAP.timeline({
        repeat: -1,
        onStart: (): void => {
          position.y = flyOffset.y;
        }
      });

      timeline
      .to(position, {
        duration: 3,
        ease: "sine.inOut",
        y: flyOffset.y + 0.5
      })
      .to(position, {
        duration: 6,
        ease: "sine.inOut",
        y: flyOffset.y - 0.5
      })
      .to(position, {
        duration: 3,
        ease: "sine.inOut",
        y: flyOffset.y
      });
    }
  }

  lookToTarget(): void {
    const {x, y, z}: THREE.Vector3 = this.target.position;
    const {lookOffset} = constants;

    this.camera.lookAt(x + lookOffset.x, y + lookOffset.y, z + lookOffset.z);
  }

  update(deltaTime: number): void {
    this.controls.update();

    this.lookToTarget();

    if (this.isFlyingCamera)
      this.flying(deltaTime);
  }
}
