import { Command } from 'commander';
import { debug, em, error, getCWD, log } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { ToolchainNetworks } from '../../modules/config';
import { testWithJest } from '../../modules/jest';
import { JestCommandOptions } from '../../modules/jest/types';

export const addE2ETestCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('e2e-test')
    .description('Perform end-to-end tests on smart contracts with Jest.')
      .option('-n, --network <network>', `Choose to run test either in ${ToolchainNetworks.SANDBOX} or ${ToolchainNetworks.TESTNET} networks`)
      .option('-c, --contracts <contracts>', 'Run E2E tests on a specific contract, rather than deploying it. Argument must be in the form of \"filename.ext:contractAddress\". You can pass more than one file:contract pairs separated by a semicolon (;)')
      .option('--old-build', 'Use the latest contract build found instead of stopping/rebuilding')
    .action((options) => {
      test(program, options);
    })
    .hook('preAction', debugHook);
}

// Lauch Jest to run unit tests
export const test = async (program: Command, options: any) => {
  em(`Perform E2E tests...\n`);

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());

  // Extract options from CLI
  const {
    contracts,
    ...otherOptions
  } = options;

  // Prepare options
  const defaultOptions: JestCommandOptions = {
    network: ToolchainNetworks.SANDBOX,
  };

  // Build final options
  const testOptions: JestCommandOptions = Object.assign({}, defaultOptions, otherOptions);

  // Force E2E testing
  testOptions.e2e = true;

  // Read the config so contracts folder settings will be there later
  await contractsBundle.readConfigFile();

  if (contracts) {
    const contractNames = await contractsBundle.getContractsFiles();

    const deployedContracts: any = {};
    const pairs = (contracts as string).split(';');

    for (const pair of pairs) {
      const tokens = pair.split(':');

      if (tokens.length !== 2) {
        error(`Contracts argument is in the wrong format: "${pair}" is not in the form "filename.ext:contractAddress!"`);
        process.exit(1);
      }

      if (!contractNames.find(x => x === tokens[0])) {
        error(`Contracts argument specifies a contract which is not part of this repository: "${tokens[0]}"`);
        process.exit(1);
      }

      deployedContracts[tokens[0]] = tokens[1];
    }

    testOptions.deployedContracts = deployedContracts;
  }

  log(`Working on "${testOptions.network}" network`);

  await testWithJest(contractsBundle, testOptions);
};