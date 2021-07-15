import { Command } from 'commander';

import { em, debug, setDebug } from "../../console";

export const addCompileCommand = (program: Command) => {
  program
    .command('compile')
    .description('compile contract(s) using LIGO compiler.')
      // .option('-h, --host <host>', 'Sandbox hostname')
    .action((options) => {
      compile(options);
    });
}

// Full start-sandbox command controller
export const compile = async (options: any) => {
  em(`Compiling contracts...\n`);

  // Debug options code
  debug(JSON.stringify(options, null, 2));

  
};