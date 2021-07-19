import { Command } from 'commander';

import { em, debug, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { compileWithLigo, LigoCompilerOptions, LIGOVersions } from '../../modules/ligo';
import { toLigoVersion } from '../../modules/ligo/parameters';

export const addCompileCommand = (program: Command) => {
  program
    .command('compile')
    .description('compile contract(s) using LIGO compiler.')
      .option('-c, --contract <contract>', 'Compile a single smart contract source file')
      .option('-l, --ligo-version <version>', `Choose a specific LIGO version. Default is "next", available are: ${Object.values(LIGOVersions).join(', ')}`)
      .option('-f, --force', 'Force the compilation avoiding LIGO version warnings')
    .action((options) => {
      compile(options);
    });
}

// Full start-sandbox command controller
export const compile = async (options: any) => {
  em(`Compiling contracts...\n`);

  // Debug options code
  debug(JSON.stringify(options, null, 2));

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());
  const { ligoVersion } = await contractsBundle.readConfigFile();

  // Extract the needed settings, with typecheck
  const compilerConfig: LigoCompilerOptions = {
    ligoVersion,
  };

  // Validate versions
  if (options.ligoVersion) {
    options.ligoVersion = toLigoVersion(options.ligoVersion);
  }

  // Build final options
  const compilerOptions = Object.assign({}, compilerConfig, options);

  await compileWithLigo(contractsBundle, compilerOptions);
};