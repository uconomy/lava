import chalk from 'chalk';

export const info = console.log;

export const em = (...args: any[]) => 
  console.log(chalk.greenBright`${args.join(' ')}`);

export const warn = (...args: any[]) => 
  console.log(chalk.yellow`${args.join(' ')}`);

export const error = (...args: any[]) => 
  console.log(chalk.red`${args.join(' ')}`);
