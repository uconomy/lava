import chalk from 'chalk';

let debugFlag = false;
export const setDebug =(_debug: boolean) => 
  debugFlag = _debug;

export const log = (...args: any[]) => 
  debugFlag && console.log(chalk.cyan`${args.join(' ')}`);

export const info = (...args: any[]) => 
  console.log(chalk.white`${args.join(' ')}`);

export const em = (...args: any[]) => 
  console.log(chalk.greenBright`${args.join(' ')}`);

export const warn = (...args: any[]) => 
  console.log(chalk.yellow`${args.join(' ')}`);

export const error = (...args: any[]) => 
  console.log(chalk.red`${args.join(' ')}`);
