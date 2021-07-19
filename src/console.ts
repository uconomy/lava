import chalk from 'chalk';
import path from 'path';

let debugFlag = false;
export const setDebug = (_debug: boolean) => 
  debugFlag = _debug;

let cwd = process.cwd()
export const setCWD = (_cwd: string) => cwd = path.resolve(process.cwd(), _cwd);
export const getCWD = () => cwd;

export const debug = (...args: any[]) => 
  debugFlag && console.log(chalk.cyan(args));

export const log = (...args: any[]) => 
  console.log(chalk.white(args));

export const em = (...args: any[]) => 
  console.log(chalk.greenBright(args));

export const warn = (...args: any[]) => 
  console.log(chalk.yellow(args));

export const error = (...args: any[]) => 
  console.log(chalk.redBright(args));
