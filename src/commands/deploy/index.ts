import { Command } from 'commander';
import { em } from "../../console";

export const addDeployCommand = (program: Command, debugHook: (cmd: Command) => void) => {
  program
    .command('deploy')
    .description('Deploy a smart contract on a Tezos network.')
      .option('-c, --contract <contract>', 'Compile a single smart contract source file')
      // .option('-l, --ligo-version <version>', `Choose a specific LIGO version. Default is "next", available are: ${Object.values(LIGOVersions).join(', ')}`)
      // .option('-f, --force', 'Force the compilation avoiding LIGO version warnings')
    .action((options) => {
      depoloy(options);
    })
    .hook('preAction', debugHook);
}

// Deploy a Smart Contract
export const depoloy = async (options: any) => {
  em(`Deploying contracts...\n`);

  // // Read configfile
  // const contractsBundle = new ContractsBundle(getCWD());
  // const { ligoVersion } = await contractsBundle.readConfigFile();

  // // Extract the needed settings, with typecheck
  // const compilerConfig: LigoCompilerOptions = {
  //   ligoVersion,
  // };

  // // Validate versions
  // if (options.ligoVersion) {
  //   options.ligoVersion = toLigoVersion(options.ligoVersion);
  // }

  // // Build final options
  // const compilerOptions = Object.assign({}, compilerConfig, options);

  // await compileWithLigo(contractsBundle, compilerOptions);
};