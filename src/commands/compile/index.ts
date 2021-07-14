import { Command } from 'commander';

import { em, log, setDebug } from "../../console";

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
  em`Compiling contracts...\n`;
  
  const { debug, ...commandOptions } = options;
  setDebug(debug);

  // Debug options code
  log(JSON.stringify(options, null, 2));

  
};