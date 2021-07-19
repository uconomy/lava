import { LIGOFlavors, LIGOVersions } from "../ligo";
import { defaultConfig } from "./defaults";
import { Config } from "./types";

export class ConfigFile {
  config: Config;

  constructor(config = defaultConfig) {
    this.config = config;
  }

  static getName() {
    return "config.json";
  }

  validate() {
    const validLigoVersions = Object.values(LIGOVersions);
    if (!validLigoVersions.includes(this.config.ligoVersion)) {
      throw new Error("Invalid LIGO compiler version (ligoVersion). Maybe it's too old? Valid values are " + validLigoVersions.join(", "));
    }

    const validLigoFlavors = Object.values(LIGOFlavors);
    if (!validLigoFlavors.includes(this.config.preferredLigoFlavor)) {
      throw new Error("Invalid preferred LIGO flavor (preferredLigoFlavor). Valid values are " + validLigoFlavors.join(", "));
    }
  }
}