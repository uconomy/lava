import path from 'path';
import { error } from "../../../console";
import { createBundle } from "../../../modules/bundle";
import { Config, ConfigFile } from "../../../modules/config";
import { getContractFileName, makeContractFile } from "./make-contract";
import { makeJestConfig } from "./make-jest-config";
import { makePackageJSON } from "./make-package.json";
import { makeREADME } from "./make-readme";
import { makeTest } from './make-test';

export type ContractBundleOptions = {
  basePath: string;
  config: Config;
  hasExamples: boolean;
};

export const makeContractBundle = async (params: ContractBundleOptions) => {
  const {
    basePath,
    config,
    hasExamples,
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

  // Jest config
  await bundle.writeTextFile('jest.config.js', makeJestConfig(config.repoName));

  // package.json
  await bundle.writeJSONFile('package.json', makePackageJSON(config.repoName));

  // Generate contract filename
  const contractFileName = getContractFileName(config.preferredLigoFlavor, config.repoName);

  // Example files or only placeholders?
  let contractData = '';
  let testData = makeTest(config.repoName, contractFileName, false);
  if (hasExamples) {
    contractData = makeContractFile(config.preferredLigoFlavor);
    testData = makeTest(config.repoName, contractFileName, true);
  }

  // Write contract file
  await bundle.writeTextFile(
    path.join('contracts', contractFileName),
    contractData,
  );

  // Write test file
  await bundle.writeTextFile(
    path.join('test', `${config.repoName}.test.js`),
    testData,
  );
};