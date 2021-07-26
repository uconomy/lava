import { getCWD, log } from "../../console";
import { ContractsBundle } from "../bundle";
import { ToolchainNetworks } from "../config";
import { CustomJestGlobals, isFaucet } from "./types";

export const setupJestEnv = async (): Promise<CustomJestGlobals> => {
  const {
    tezosToolchainNetwork,
  } = process.env;

  const cwd = getCWD();
  const bundle = new ContractsBundle(cwd);
  const config = await bundle.readConfigFile();

  // Start to configure Sandbox, then will switch to Testnet if --tezosToolchainNetwork=testnet was passed in command ENV
  let network: CustomJestGlobals['tezosToolchainNetwork'] = ToolchainNetworks.SANDBOX;
  let signer: CustomJestGlobals['tezosDefaultSigner'] = config.networks.sandbox.defaultSignerSK;
  let rpcNode: string = `http://${config.sandbox.host}:${config.sandbox.port}`;

  if (tezosToolchainNetwork){
    if (tezosToolchainNetwork === ToolchainNetworks.TESTNET) {
      network = ToolchainNetworks.TESTNET;
      rpcNode = `${config.networks.testnet.host}:${config.networks.testnet.port}`;

      if (config.networks.testnet.faucet && isFaucet(config.networks.testnet.faucet)) {
        signer = config.networks.testnet.faucet;
      }
    } else if (tezosToolchainNetwork !== ToolchainNetworks.SANDBOX) {
      throw new Error(`ERROR: The specified network "${tezosToolchainNetwork}" is not available. Please use either sandbox or testnet.`);
    }
  }

  return {
    tezosRPCNode: rpcNode,
    tezosToolchainNetwork: network,
    tezosDefaultSigner: signer,
    tezosCWD: cwd,
  };
};
