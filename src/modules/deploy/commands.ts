import { importKey, InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { em, error, log, warn } from "../../console";
import { BuildErrorCodes, ContractsBundle } from "../bundle";
import { Config, ToolchainNetworks } from "../config";
import { isFaucet } from "../jest/types";
import { DeployCommandOptions } from "./types";

const deployInSandbox = async (code: object[], config: Config) => {
  // Setup the basic Taquito client
  const Tezos = new TezosToolkit(`http://${config.sandbox.host}:${config.sandbox.port}`);

  // Set the signer
  Tezos.setProvider({
    signer: new InMemorySigner(config.networks.sandbox.defaultSignerSK),
  });
};

const deployInTestnet = async (code: object[], config: Config) => {
  // Setup the basic Taquito client
  const Tezos = new TezosToolkit(`${config.networks.testnet.host}:${config.networks.testnet.port}`);

  // Set the signer
  if (config.networks.testnet.faucet && isFaucet(config.networks.testnet.faucet)) {
    const signer = config.networks.testnet.faucet;

    importKey(Tezos, signer.email, signer.password, signer.mnemonic, signer.secret);
  }
};

const deployInMainnet = async (code: object[], config: Config) => {
  // const Tezos = new TezosToolkit(`${config.networks.testnet.host}:${config.networks.testnet.port}`);

  // const wallet = new BeaconWallet({ name: 'temple' });
  // const network = { type: NetworkType.FLORENCENET };
  // await wallet.requestPermissions({ network })
  // Tezos.setWalletProvider(wallet)

  // Tezos.wallet
  //   .originate({
  //     code: code,
  //     storage: {
  //       stored_counter: 0,
  //       threshold: 1,
  //       keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'],
  //     },
  //   })
  //   .send()
  //   .then((originationOp) => {
  //     log(`Waiting for confirmation of origination...`);
  //     return originationOp.contract();
  //   })
  //   .then((contract) => {
  //     log(`Origination completed for ${contract.address}.`);
  //   })
  //   .catch((err) => error(`Error: ${JSON.stringify(err, null, 2)}`));

  error('Deploying in Mainnet is still not supported.');
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

  switch (options.network) {
    case ToolchainNetworks.SANDBOX:
      return await deployInSandbox(code, config);
    case ToolchainNetworks.TESTNET:
      return await deployInTestnet(code, config);
    case ToolchainNetworks.MAINNET:
      return await deployInMainnet(code, config);
    default:
      warn(`Unknown network "${options.network}", defaulting to sandbox environment.`);
      return await deployInSandbox(code, config);
  }
};