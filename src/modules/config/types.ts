import { LIGOFlavors, LIGOVersions } from "../ligo";
import { FaucetAccount, TezosProtocols } from "../tezos";

export type Config = {
  repoName: string;

  // LIGO Settings
  ligoVersion: LIGOVersions;
  preferredLigoFlavor: LIGOFlavors;

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
    sandbox: { // Sandbox network settings; host and port are not required as we can derive from sandbox config
      defaultSignerSK: string; // Default Tezos' actions signer, used to deploy contract and later interact with it
    },

    testnet: { // Remember you need to pass --testnet to test or deploy commands to run on this network
      host: string;
      port: number;
      faucet: {} | FaucetAccount; // You can get one at https://faucet.tzalpha.net
    },

    mainnet: { // This network can only be used to deploy, no tests allowed here
      host: string;
      port: number;
    }
  }
};