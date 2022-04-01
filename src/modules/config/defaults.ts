import { DEFAULT_LIGO_VERSION, LIGOFlavors } from "../ligo";
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
  ligoVersion: DEFAULT_LIGO_VERSION,
  preferredLigoFlavor: LIGOFlavors.JsLIGO,

  // Automatic compilation on old/missing build file
  autoCompile: false,

  // Automatic start/stop sandbox when testing (does NOT work for deploy)
  autoSandbox: false,

  // Sandbox Settings
  sandbox: {
    host: "localhost",
    port: 20000,
    protocol: TezosProtocols.HANGZHOU,
    genesisBlockHash: "random",
    accounts: {
      alice: {
        pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        sk: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
        pk: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn"
      },
      bob: {
          pkh: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
          sk: "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt",
          pk: "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4"
      },
      eve: {
          pk: "edpku9qEgcyfNNDK6EpMvu5SqXDqWRLuxdMxdyH12ivTUuB1KXfGP4",
          pkh: "tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6",
          sk: "edsk3Sb16jcx9KrgMDsbZDmKnuN11v4AbTtPBgBSBTqYftd8Cq3i1e"
      },
    }
  },

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
    sandbox: {
      // Default Tezos' actions signer Secret Key, used to deploy contract and later interact with it
      defaultSignerSK: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
    },

    testnet: {
      host: "https://testnet-tezos.giganode.io",
      port: 443,
      faucet: null, // You can get one at https://faucet.tzalpha.net
    },

    mainnet: {
      host: "https://mainnet-tezos.giganode.io",
      port: 443
    }
  },

  // Folder settings (relative to this file position)
  contractsDirectory: "contracts",
  outputDirectory: "build"
};