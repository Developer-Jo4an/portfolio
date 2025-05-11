import {LoadersManager} from "../LoadersManager.ts";
import JSONLoader from "./JSONLoader.ts";
import SVGLoader from "./SVGLoader.ts";

export class BaseManager extends LoadersManager {

  getLoader({type}) {
    switch (type) {
      case "json":
        return JSONLoader;
      case "svg":
        return SVGLoader;
    }
  }
}

export const baseManager = new BaseManager();
