import { Command } from 'commander';
import { debug, em, getCWD, log } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { ToolchainNetworks } from '../../modules/config';
import { testWithJest } from '../../modules/jest';
import { JestCommandOptions } from '../../modules/jest/types';

export const addTestCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('test')
    .description('Perform unit tests on smart contracts with Jest.')
      .option('-n, --network <network>', `Choose to run test either in ${ToolchainNetworks.SANDBOX} or ${ToolchainNetworks.TESTNET} networks`)
      .option('--old-build', 'Use the latest contract build found instead of stopping/rebuilding')
    .action((options) => {
      test(program, options);
    })
    .hook('preAction', debugHook);
}

// Lauch Jest to run unit tests
export const test = async (program: Command, options: any) => {
  em(`Perform unit tests...\n`);

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());

  // Prepare options
  const defaultOptions: JestCommandOptions = {
    network: ToolchainNetworks.SANDBOX,
  };

  // Build final options
  const testOptions: JestCommandOptions = Object.assign({}, defaultOptions, options);

  log(`Working on "${testOptions.network}" network`);

  await testWithJest(contractsBundle, testOptions);
};