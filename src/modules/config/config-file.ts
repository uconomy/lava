import { LIGOFlavors, LIGOVersions } from "../ligo";
import { defaultConfig } from "./defaults";
import { Config } from "./types";

export class ConfigFile {
  config: Config = defaultConfig;

  getName() {
    return "config.json";
  }

  validate() {
    const validLigoVersions = Object.values(LIGOVersions);
    if (!validLigoVersions.includes(this.config.ligoVersion)) {
      throw new Error("Invalid LIGO compiler version (ligoVersion). Valid values are " + validLigoVersions.join(","));
    }

    const validLigoFlavors = Object.values(LIGOFlavors);
    if (!validLigoFlavors.includes(this.config.preferredLigoFlavor)) {
      throw new Error("Invalid preferred LIGO flavor (preferredLigoFlavor). Valid values are " + validLigoFlavors.join(","));
    }
  }

  parseFrom(data: string) {
    this.config = JSON.parse(data);
  }

  toDataString() {
    return JSON.stringify(this.config, null, 2);
  }
}