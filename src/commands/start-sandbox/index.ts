import { Command } from 'commander';

import { em, debug, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { startFlextesa } from "../../modules/flextesa";

export const addStartSandboxCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('start-sandbox')
    .description('Create a local Flextesa Tezos test network.')
      .option('-h, --host <host>', 'Sandbox hostname')
      .option('-p, --port <port>', 'Sandbox port')
      .option('-P, --protocol <protocol>', 'What Tezos protocol will this Sanbox run')
      .option('-g, --genesis-block', 'The first block to start the Sandbox with')
    .action((options) => {
      startSandbox(options);
    })
    .hook('preAction', debugHook);
}

// Full start-sandbox command controller
export const startSandbox = async (options: any, readyCallback?: () => void) => {
  em(`Starting Tezos sandbox...\n`);

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  const config = await contractsBundle.readConfigFile();

  // Build final options
  const flextesaOptions = Object.assign({}, config.sandbox, options);

  startFlextesa(flextesaOptions, readyCallback);
};