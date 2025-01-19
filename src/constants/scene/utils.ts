interface Utils {
  [propName: string]: (...props: any[]) => void;
}

export const utils: Utils = {
  setTransformation: <ObjType extends { set(x?: number, y?: number, z?: number): void }>
  (
    params: Partial<Record<"rotation" | "scale" | "position", { x?: number; y?: number; z?: number }>>,
    obj: ObjType
  ) => {
    for (const key in params) {
      const value = params[key];
      value && obj[key].set(value.x, value.y, value.z);
    }
  }
};
