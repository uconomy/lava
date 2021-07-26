import { Command } from 'commander';
import { em, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';

export const addDeployCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('deploy')
    .description('Deploy a smart contract on a Tezos network.')
      .option('-c, --contract <contract>', 'Compile a single smart contract source file')
    .action((options) => {
      deploy(options);
    })
    .hook('preAction', debugHook);
}

// Deploy a Smart Contract
export const deploy = async (options: any) => {
  em(`Deploying contracts...\n`);

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  // const {  } = await contractsBundle.readConfigFile();

  // // Extract the needed settings, with typecheck
  // const compilerConfig: LigoCompilerOptions = {
  //   ligoVersion,
  // };


};