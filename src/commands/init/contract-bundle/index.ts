import { error } from "../../../console";
import { createBundle } from "../../../modules/bundle";
import { Config, ConfigFile } from "../../../modules/config";
import { makePackageJSON } from "./make-package.json";
import { makeREADME } from "./make-readme";

export type ContractBundleOptions = {
  basePath: string;
  config: Config;
};

export const makeContractBundle = async (params: ContractBundleOptions) => {
  const {
    basePath,
    config,
  } = params;

  const bundle = await createBundle(config.repoName, basePath);

  // .gitignore
  await bundle.writeTextFile('.gitignore', "build\nnode_modules\npackage-lock.json");

  // prepare folders
  await bundle.makeDir("contracts");
  await bundle.makeDir("test");
  await bundle.makeDir("scripts");

  // README
  await bundle.writeTextFile('README.md', makeREADME(config.repoName));

  // Config file
  const configFile = new ConfigFile(config);
  try {
    configFile.validate();
  } catch(validationError) {
    error(`Could not create smart contract repository configuration:\n\n${validationError}`);
    process.exit(1);
  }

  await bundle.writeJSONFile(ConfigFile.getName(), configFile.config, true);

  // package.json
  await bundle.writeJSONFile('package.json', makePackageJSON(config.repoName));
};