import inquirer from 'inquirer';
import { em } from "../../console";
import { ConfigFile, LIGOFlavors } from '../../modules/configfile';
import { makeContractBundle } from './contract-bundle';

// Specifically instance a new Inquirer prompt
const prompt = inquirer.createPromptModule();

const config = new ConfigFile();

// Grab contract name
const grabName = async () => {
  const res = await prompt([{
    type: "input",
    name: "contractName",
    message: "What will be the name of the contract?"
  }]);

  config.contractName = res.contractName;
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
    default: config.ligoFlavor,
    choices: Object.keys(availFlavors).map(value => ({ name: availFlavors[value as LIGOFlavors], value })),
    name: "ligoFlavor",
    message: "What LIGO flavor do you prefer to write your contract with?"
  }]);

  config.ligoFlavor = res.ligoFlavor;
};

// Full init command controller
export const init = async () => {
  em`Welcome, let's create your Tezos smart-contract!\n\n`;

  // await makeContractBundle({
  //   basePath: process.cwd() + '/tezt',
  //   name: 'My Test Contract'
  // });

  await grabName();
  await grabFlavor();

  // console.log(JSON.stringify(config, null, 2));

  await makeContractBundle({
    basePath: process.cwd(),
    name: config.contractName,
  });
};