import { LIGOFlavors, LIGOVersions } from "../ligo";
import { TezosProtocols } from "../tezos";
import { Config } from "./types";

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