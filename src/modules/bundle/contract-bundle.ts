import { error, warn } from "../../console";
import { Config, ConfigFile, defaultConfig } from "../config";
import { Bundle } from "./bundle";

export class ContractsBundle extends Bundle {
  config: Config = defaultConfig;

  async readConfigFile(): Promise<Config> {
    const fileName = ConfigFile.getName();

    if (!this.exists(fileName)) {
      warn("This smart contract repository it's missing \"config.json\" file, will proceed with default config instead.");
    } else {
      const config = await this.readJSONFile<Config>(fileName);

      const configFile = new ConfigFile(config);

      try {
        configFile.validate();
      } catch(validationError) {
        error(`Could not read smart contract repository configuration:\n\n${validationError}`);
        process.exit(1);
      }

      this.config = config;
    }

    return this.config;
  }

  async getContracts() {

  }
}