import BaseShadow from "./BaseShadow.ts";

export default class Shadow extends BaseShadow {
  constructor(data, type) {
    super(data, type);

    this.initProperties(data);
    this.init();
  }
}
