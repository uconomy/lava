import { LIGOFlavors, LIGOVersion } from "../ligo";
import { FaucetAccount, TezosProtocols } from "../tezos";

export enum ToolchainNetworks {
  SANDBOX = 'sandbox',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export type Config = {
  repoName: string;

  // LIGO Settings
  ligoVersion: LIGOVersion;
  preferredLigoFlavor: LIGOFlavors;

  // Automatic compilation on old/missing build file when testing/deploying
  autoCompile: boolean;

  // Automatic start/stop sandbox when testing (does NOT work for deploy)
  autoSandbox: boolean;

  // Sandbox Settings
  sandbox: {
    host: string;
    port: number;
    protocol: TezosProtocols;
    genesisBlockHash: string; // the actual hash or "random" to let Flextesa find one randomly
    accounts: {
      [accountName: string]: {
        pkh: string;
        sk: string;
        pk: string;
      };
    }
  };

  /**
   * Newtork settings
   *
   * These settings make up three aliases for the network you'll probably need while developing a
   * smart contract on Tezos:
   * - sandbox:   the local sandboxed network used to run unit tests and to test contract deploying
   * - testnet:   the remote test network you can use to run (unit or) e2e tests and to deploy contract and test integration with your app
   * - mainnet:   the public node of the real Tezos network, used only to deploy the finished contract
   */
  networks: {
    [ToolchainNetworks.SANDBOX]: { // Sandbox network settings; host and port are not required as we can derive from sandbox config
      defaultSignerSK: string; // Default Tezos' actions signer Secret Key, used to deploy contract and later interact with it
    },

    [ToolchainNetworks.TESTNET]: { // Remember you need to pass --testnet to test or deploy commands to run on this network
      host: string;
      port: number;
      faucet: null | FaucetAccount; // You can get one at https://teztnets.xyz
    },

    [ToolchainNetworks.MAINNET]: { // This network can only be used to deploy, no tests allowed here
      host: string;
      port: number;
    }
  },

  // Folder settings (relative to this file position)
  contractsDirectory: string;
  outputDirectory: string;
};
