import { Contract, launchDeployer, NetworkType } from 'tezos-builder-suite';

import { error, warn, em } from "../../console";
import { BuildErrorCodes, ContractsBundle } from "../bundle";
import { Config, ToolchainNetworks } from "../config";
import { DeployCommandOptions } from "./types";

const deployInSandbox = async (contract: Contract, config: Config) => {
  launchDeployer({
    contracts: [contract],
    endpoint: {
      url: `http://${config.sandbox.host}:${config.sandbox.port}`,
      scope: 'sandbox',
      signerPrivateKey: config.networks.sandbox.defaultSignerSK,
      protocolVersion: `${config.sandbox.protocol}net` as NetworkType,
    },
    onDeployCompleted: (_, address) => {
      em(`Contract successfully deployed at address: ${address}`);
      process.exit(0);
    }
  }, { openBrowser: true });
};

const deployInTestnet = async (contract: Contract, config: Config) => {
  launchDeployer({
    contracts: [contract],
    endpoint: {
      url: `${config.networks.testnet.host}:${config.networks.testnet.port}`,
      scope: 'testnet',
      faucet: config.networks.testnet.faucet || undefined,
      protocolVersion: NetworkType.GRANADANET,
    },
    onDeployCompleted: (_, address) => {
      em(`Contract successfully deployed at address: ${address}`);
      process.exit(0);
    }
  }, { openBrowser: true });
};

const deployInMainnet = async (contract: Contract, config: Config) => {
  launchDeployer({
    contracts: [contract],
    endpoint: {
      url: `${config.networks.testnet.host}:${config.networks.testnet.port}`,
      scope: 'mainnet',
      protocolVersion: NetworkType.MAINNET,
    },
    onDeployCompleted: (_, address) => {
      em(`Contract successfully deployed at address: ${address}`);
      process.exit(0);
    }
  }, { openBrowser: true });
};

const _failWith = (str: string) => {
  error(str);

  process.exit(1);
}

export const deployContract = async (bundle: ContractsBundle, options: DeployCommandOptions) => {
  const contractName = options.contract;
  const sourcePath = bundle.getContractFile(contractName);
  if (!bundle.exists(sourcePath)) {
    _failWith(`ERROR: Specified contract "${contractName}" doesn't exist.`);
  }

  if (!bundle.buildFileExists(contractName)) {
    _failWith(`ERROR: Specified contract "${contractName}" has never been compiled.`);
  }

  const contract = await bundle.readContract(contractName);
  const hash = bundle.generateHash(contract);

  const buildFile = await bundle.readBuildFile(contractName);

  // Validate build file
  switch(bundle.isBuildValid(sourcePath, hash, buildFile)) {
    case BuildErrorCodes.MICHELSON_MISSING: 
      _failWith(`ERROR: Invalid contract "${contractName}", Michelson code is missing!`);
    case BuildErrorCodes.INVALID_HASH:
      _failWith(`ERROR: It seems the contract "${contractName}" has been edited since last compilation, stopping deploy.`);
    case BuildErrorCodes.INVALID_SOURCE_PATH:
      _failWith(`ERROR: The compiled version for "${contractName}" was compiled from a different source path "${buildFile.sourcePath}", stopping deploy.`);
    case true:
      break;
  }

  // Parse JSON-michelson
  let code: object[] = [];
  try {
    code = JSON.parse(buildFile.michelson);
  } catch (err) {
    _failWith(`ERROR: Failed to parse JSON-Michelson for contract ${contractName}, given error was: ${err}`);
  }

  const config = await bundle.readConfigFile();
  const contractObject: Contract = {
    name: contractName,
    code: contract,
    michelson: JSON.stringify(code),
  };

  switch (options.network) {
    case ToolchainNetworks.SANDBOX:
      return await deployInSandbox(contractObject, config);
    case ToolchainNetworks.TESTNET:
      return await deployInTestnet(contractObject, config);
    case ToolchainNetworks.MAINNET:
      return await deployInMainnet(contractObject, config);
    default:
      warn(`Unknown network "${options.network}", defaulting to sandbox environment.`);
      return await deployInSandbox(contractObject, config);
  }
};