import { Command } from 'commander';
import inquirer from 'inquirer';
import { em, getCWD, log } from "../../console";
import { Config, defaultConfig } from '../../modules/config';
import { LIGOFlavors } from '../../modules/ligo';
import { makeContractBundle } from './contract-bundle';

// Specifically instance a new Inquirer prompt
const prompt = inquirer.createPromptModule();

// Prepare our "empty" config
const config: Config = defaultConfig;

// Grab repository name
const grabName = async () => {
  const res = await prompt([{
    type: "input",
    name: "repoName",
    message: "What will be the name of the repository?"
  }]);

  config.repoName = res.repoName;
};

// Grab LIGO flavor
const grabFlavor = async () => {
  const availFlavors: {[x in LIGOFlavors]: string} = {
    [LIGOFlavors.PascaLIGO]: "PascaLIGO",
    [LIGOFlavors.CameLIGO]: "CameLIGO",
    [LIGOFlavors.ReasonLIGO]: "ReasonLIGO",
    [LIGOFlavors.JsLIGO]: "JsLIGO"
  };

  const res = await prompt([{
    type: "list",
    default: defaultConfig.preferredLigoFlavor,
    choices: Object.keys(availFlavors).map(value => ({ name: availFlavors[value as LIGOFlavors], value })),
    name: "preferredLigoFlavor",
    message: "What LIGO flavor do you prefer to write your contract with?"
  }]);

  config.preferredLigoFlavor = res.preferredLigoFlavor;
};

// Ask for examples
const grabExamplesPreference = async () => {
  const res = await prompt([{
    type: "list",
    default: true,
    choices: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
    name: "hasExamples",
    message: "Would you like to have some example code in the newly created repo?",
  }]);

  return res.hasExamples;
};

export const addInitCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('init')
    .description('Starts a small configuration utility to create a new smart contract repo.')
    .argument('[name]', "(Optional) The name of the new repo to be created")
    .action((name) => {
      init(name);
    })
    .hook('preAction', debugHook);
}

// Full init command controller
export const init = async (name?: string) => {
  em(`Welcome, let's create your Tezos smart-contract!\n`);

  if (name) {
    config.repoName = name;

    log(`The name of the repository will be "${name}".\n`);
  } else {
    await grabName();
  }

  await grabFlavor();

  const hasExamples = await grabExamplesPreference();

  await makeContractBundle({
    basePath: getCWD(),
    config,
    hasExamples,
  });
};