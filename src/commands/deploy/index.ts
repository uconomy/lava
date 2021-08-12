import { Command } from 'commander';
import { em, error, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { ToolchainNetworks } from '../../modules/config';
import { DeployCommandOptions, deployContract } from '../../modules/deploy';

export const addDeployCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('deploy')
    .description('Deploy a smart contract on a Tezos network.')
      .option('-c, --contract <contract>', 'Compile a single smart contract source file')
      .option('-n, --network <network>', `Choose to perform origination in, either ${ToolchainNetworks.SANDBOX}, ${ToolchainNetworks.TESTNET} or ${ToolchainNetworks.MAINNET} networks.`)
      .option('--old-build', 'Use the latest contract build found instead of stopping/rebuilding')
    .action((options) => {
      deploy(options);
    })
    .hook('preAction', debugHook);
}

// Deploy a Smart Contract
export const deploy = async (options: any) => {
  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  // const {  } = await contractsBundle.readConfigFile();

  const contracts = await contractsBundle.getContractsFiles();
  if (contracts.length === 0) {
    error('This repository contains no contract files, slipping deploy.');
    return;
  } else if (contracts.length > 1 && !options.contract) {
    error('This repository contains more than one contract, but no contract was specified in command options (use --contract <contractName>).');
    return;
  }

  const contract = options.contract || contracts[0];
  em(`Deploying contract "${contract}"...\n`);

  // Deploy configuration
  const defaultOptions: DeployCommandOptions = {
    network: ToolchainNetworks.SANDBOX,
    contract,
    oldBuild: false,
  };

  // Build final options
  const deployOptions: DeployCommandOptions = Object.assign({}, defaultOptions, options);

  await deployContract(contractsBundle, deployOptions);
};