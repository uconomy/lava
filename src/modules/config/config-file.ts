import { LIGOFlavors } from "../ligo";
import { toLigoVersion } from "../ligo/parameters";
import { defaultConfig } from "./defaults";
import { Config } from "./types";

export class ConfigFile {
  config: Config;

  constructor(config = defaultConfig) {
    this.config = config;
  }

  static getName(): string {
    return "config.json";
  }

  validate(): void {
    try {
      toLigoVersion(this.config.ligoVersion);
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error(`Invalid LIGO compiler version (ligoVersion: "${this.config.ligoVersion}"). LIGO version has to be a valid SemVer version or "next".`);
      }
    }

    const validLigoFlavors = Object.values(LIGOFlavors);
    if (!validLigoFlavors.includes(this.config.preferredLigoFlavor)) {
      throw new Error("Invalid preferred LIGO flavor (preferredLigoFlavor). Valid values are " + validLigoFlavors.join(", "));
    }
  }
}