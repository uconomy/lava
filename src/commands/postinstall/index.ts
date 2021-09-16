import { Command } from 'commander';

import { em, getCWD } from "../../console";
import { ContractsBundle } from '../../modules/bundle';
import { makeJestConfig } from '../init/contract-bundle/make-jest-config';

export const addPostInstallCommand = (program: Command, debugHook: (cmd: Command) => void): void => {
  program
    .command('postinstall', { hidden: true })
    .action(() => {
      postInstallSetup();
    })
    .hook('preAction', debugHook);
}

// Full start-sandbox command controller
export const postInstallSetup = async (): Promise<void> => {
  em(`Finishing toolchain setup...\n`);

  // Read configfile
  const contractsBundle = new ContractsBundle(getCWD());

  // Create Jest config with local commands so we don't loose config over missing npx files
  await contractsBundle.writeTextFile('jest.config.js', makeJestConfig());

  em('Done.')
};