import {BaseEntityController, BaseEntityProps} from "./BaseEntityController.ts";

export class ActorController extends BaseEntityController {
  actor: THREE.Mesh;

  constructor(data: BaseEntityProps) {
    super(data);

    this.init();
  }

  init(): void {
    const actor: THREE.Mesh = ((): THREE.Mesh => {
      const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: "red"});
      return new THREE.Mesh(geometry, material);
    })();

    actor.name = "actor";

    actor.position.set(0, 0.5, 0);

    this.scene.add(this.actor = actor);
  }
}
