import { Command } from 'commander';
import { addCompileCommand } from './commands/compile';
import { addInitCommand } from './commands/init';
import { addStartSandboxCommand } from './commands/start-sandbox';
import { log, setCWD, setDebug } from './console';

const program = new Command();

program
  .version("0.0.1")
  .option('--debug', 'run the command in debug mode, with a lot more details about it')
  .option('-f, --folder <cwd>', 'change the working directory to the specified folder')

addInitCommand(program);
addStartSandboxCommand(program);
addCompileCommand(program);

program.parse(process.argv);

const globalOptions = program.opts();

if (globalOptions.debug) {
  setDebug(true);
}

if (globalOptions.folder) {
  log`Change working directory to ${globalOptions.folder}`;
  setCWD(globalOptions.folder);
}

