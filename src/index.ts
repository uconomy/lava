import { Command } from 'commander';
import { init } from './commands/init';
import { startSandbox } from './commands/start-sandbox';

const program = new Command();

program.version("0.0.1");

program
  .command('init')
  .description('Starts a small configutation utility to create a new smart contract repo.')
  .action((source, destination) => {
    init();
  });

program
  .command('start-sandbox')
  .description('Create a local Flextesa Tezos test network.')
  .action((source, destination) => {
    startSandbox();
  });

program.parse(process.argv);