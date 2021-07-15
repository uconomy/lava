import { Command } from 'commander';

import { em, debug, setDebug, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { startFlextesa } from "../../modules/flextesa";

export const addStartSandboxCommand = (program: Command) => {
  program
    .command('start-sandbox')
    .description('create a local Flextesa Tezos test network.')
      .option('-h, --host <host>', 'Sandbox hostname')
      .option('-p, --port <port>', 'Sandbox port')
      .option('-P, --protocol <protocol>', 'What Tezos protocol will this Sanbox run')
      .option('-g, --genesis-block', 'The first block to start the Sandbox with')
    .action((options) => {
      startSandbox(options);
    });
}

// Full start-sandbox command controller
export const startSandbox = async (options: any) => {
  em(`Starting Tezos sandbox...\n`);

  // Debug options code
  debug(JSON.stringify(options, null, 2));

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  const config = await contractsBundle.readConfigFile();

  // Build final options
  const flextesaOptions = Object.assign({}, config.sandbox, options);

  startFlextesa(flextesaOptions);
};