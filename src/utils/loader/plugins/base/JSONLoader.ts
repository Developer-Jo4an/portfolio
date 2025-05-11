import BaseLoader from "../BaseLoader.ts";
import {loadJSON} from "../../../load-json/load-json.ts";

export default class JSONLoader extends BaseLoader {
  load(settings) {
    const url = this.manager.resolveURL(settings.url);
    super.load(url);

    return loadJSON(url).then(
      (data) => this.onLoad(settings, data),
      (error) => this.onError(error)
    );
  }
}
