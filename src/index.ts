import { Command } from 'commander';
import { addInitCommand } from './commands/init';
import { addStartSandboxCommand } from './commands/start-sandbox';

const program = new Command();

program.version("0.0.1");

addInitCommand(program);
addStartSandboxCommand(program);

program.parse(process.argv);