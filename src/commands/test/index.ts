import { Command } from 'commander';
import { debug, em, getCWD, log } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { ToolchainNetworks } from '../../modules/config';
import { testWithJest } from '../../modules/jest';
import { JestCommandOptions } from '../../modules/jest/types';

export const addTestCommand = (program: Command) => {
  program
    .command('test')
    .description('perform unit tests on smart contracts with Jest.')
      .option('-n, --network <network>', `Choose to run test either in ${ToolchainNetworks.SANDBOX} or ${ToolchainNetworks.TESTNET} networks.`)
    .action((options) => {
      test(options);
    });
}

// Lauch Jest to run unit tests
export const test = async (options: any) => {
  em(`Perform unit tests...\n`);

  // Debug options code
  debug(JSON.stringify(options, null, 2));

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  // const { ligoVersion } = await contractsBundle.readConfigFile();

  // Build final options
  const testOptions: JestCommandOptions = Object.assign({}, {
    network: ToolchainNetworks.SANDBOX,
  }, options);

  log(`Working on "${testOptions.network}" network`);

  await testWithJest(contractsBundle, testOptions);
};