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
      defaultSignerPK: string;
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
}

/**
 * Default settings
 * 
 * Some of these settings are expected to change in the init configurator.
 * For the remote networks, we use Giganode by default, read more at https://mainnet-tezos.giganode.io
 */
export const defaultConfig: Config = {
  repoName: "tezos-smart-contract",
  
  // LIGO Settings
  ligoVersion: LIGOVersions.next,
  preferredLigoFlavor: LIGOFlavors.PascaLIGO,

  // Sandbox Settings
  sandbox: {
    host: "localhost",
    port: 20000,
    protocol: TezosProtocols.FLORENCE,
    genesisBlockHash: "random",
  },

  networks: {
    sandbox: {
      defaultSignerPK: "..."
    },

    testnet: {
      host: "https://testnet-tezos.giganode.io",
      port: 443,
      faucet: {}
    },

    mainnet: {
      host: "https://mainnet-tezos.giganode.io",
      port: 443
    }
  }
};

export class ConfigFile {
  config: Config = defaultConfig;

  getName() {
    return "config.json";
  }

  validate() {
    const validLigoVersions = Object.values(LIGOVersions);
    if (!validLigoVersions.includes(this.config.ligoVersion)) {
      throw new Error("Invalid LIGO compiler version (ligoVersion). Valid values are " + validLigoVersions.join(","));
    }

    const validLigoFlavors = Object.values(LIGOFlavors);
    if (!validLigoFlavors.includes(this.config.preferredLigoFlavor)) {
      throw new Error("Invalid preferred LIGO flavor (preferredLigoFlavor). Valid values are " + validLigoFlavors.join(","));
    }
  }

  parseFrom(data: string) {
    this.config = JSON.parse(data);
  }

  toDataString() {
    return JSON.stringify(this.config, null, 2);
  }
}