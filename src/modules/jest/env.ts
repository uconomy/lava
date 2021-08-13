import { getCWD } from "../../console";
import { ContractsBundle } from "../bundle";
import { ToolchainNetworks } from "../config";
import { CustomJestGlobals, isFaucet, JestCommandEnv } from "./types";

export const setupJestEnv = async (): Promise<CustomJestGlobals> => {
  const {
    TEZOS_NETWORK,
    DEPLOYED_CONTRACTS,
  } = process.env as JestCommandEnv;

  const cwd = getCWD();
  const bundle = new ContractsBundle(cwd);
  const config = await bundle.readConfigFile();

  // Start to configure Sandbox, then will switch to Testnet if --tezosToolchainNetwork=testnet was passed in command ENV
  let network: CustomJestGlobals['tezosToolchainNetwork'] = ToolchainNetworks.SANDBOX;
  let signer: CustomJestGlobals['tezosDefaultSigner'] = config.networks.sandbox.defaultSignerSK;
  let rpcNode: string = `http://${config.sandbox.host}:${config.sandbox.port}`;

  if (TEZOS_NETWORK){
    if (TEZOS_NETWORK === ToolchainNetworks.TESTNET) {
      network = ToolchainNetworks.TESTNET;
      rpcNode = `${config.networks.testnet.host}:${config.networks.testnet.port}`;

      if (config.networks.testnet.faucet && isFaucet(config.networks.testnet.faucet)) {
        signer = config.networks.testnet.faucet;
      } else {
        throw new Error('ERROR: When running tests in testnet, a Faucet is mandatory.\nPlease get a Faucet account from https://faucet.tzalpha.net and add it in testnet config in config.json');
      }
    } else if (TEZOS_NETWORK !== ToolchainNetworks.SANDBOX) {
      throw new Error(`ERROR: The specified network "${TEZOS_NETWORK}" is not available. Please use either sandbox or testnet.`);
    }
  }

  let deployedContracts: CustomJestGlobals['tezosDeployedContracts'] | undefined = undefined;
  if (DEPLOYED_CONTRACTS) {
    const contractNames = await bundle.getContractsFiles();

    deployedContracts = {};
    const pairs = DEPLOYED_CONTRACTS.split(';');

    for (const pair of pairs) {
      const tokens = pair.split(':');

      if (tokens.length !== 2) {
        throw new Error(`Contracts argument is in the wrong format: "${pair}" is not in the form "filename.ext:contractAddress!"`);
      }

      if (!contractNames.find(x => x === tokens[0])) {
        throw new Error(`Contracts argument specifies a contract which is not part of this repository: "${tokens[0]}"`);
      }

      deployedContracts[tokens[0]] = tokens[1];
    }
  }

  return {
    tezosRPCNode: rpcNode,
    tezosToolchainNetwork: network,
    tezosDefaultSigner: signer,
    tezosCWD: cwd,
    tezosDeployedContracts: deployedContracts,
  };
};
