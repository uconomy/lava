import { Bundle, Config } from "../../../modules/bundle";
import { makeAccounts } from "./make-accounts";
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

  const bundle = new Bundle(config.repoName, basePath);

  // .gitignore
  await bundle.writeTextFile('.gitignore', "build\nnode_modules\npackage-lock.json");

  // prepare folders
  await bundle.makeDir("contracts");
  await bundle.makeDir("test");
  await bundle.makeDir("scripts");
  await bundle.makeDir("scripts/sandbox");

  // Sandbox accounts file
  await bundle.writeTextFile('scripts/sandbox/accounts.js', makeAccounts(bundle));

  // README
  await bundle.writeTextFile('README.md', makeREADME(bundle));

  // package.json
  await bundle.writeJSONFile('package.json', makePackageJSON(bundle));
};