import { TezosToolkit, ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { InMemorySigner, importKey } from "@taquito/signer";
import { CustomJestGlobals, isFaucet, JestCommandEnv, TezosSigner } from './types';
import { BuildErrorCodes, ContractsBundle } from '../bundle';
import { Config } from "../config";
import { compile } from "../../commands/compile";

type AugmentedJestGlobal = {
  Tezos: TezosToolkit;
  deployContract(contractName: string, storage: any, signer: TezosSigner): Promise<ContractAbstraction<ContractProvider>>;

  toBytes(str: string): string;

  _checkedContracts?: { [x: string]: object[] | false },
}

// This is needed to infer a type to Jest context's global variable
const jestGlobal = global as unknown as CustomJestGlobals & AugmentedJestGlobal;

// Setup the basic Taquito client
const Tezos = new TezosToolkit(jestGlobal.tezosRPCNode);

// Internal functions
const _setSigner = (signer: TezosSigner) => {
  if (isFaucet(signer)) {
    importKey(Tezos, signer.email, signer.password, signer.mnemonic.join(' '), signer.secret);

    Tezos.setProvider({ signer: new InMemorySigner(signer.pkh, signer.password) });
  } else {
    Tezos.setProvider({
      signer: new InMemorySigner(signer),
    });
  }
};

// Set default signer as expected in config
_setSigner(jestGlobal.tezosDefaultSigner);

const bundle = new ContractsBundle(jestGlobal.tezosCWD);
let config: Config;

const handleOutdatedBuildfile = async (contractName: string) => {
  const { USE_OLD_BUILD } = process.env as JestCommandEnv;

  if (USE_OLD_BUILD === 'true') {
    return; // Go on with testing
  } else {
    // Cache config for all the tests to spped up the process
    if (!config) {
      config = await bundle.readConfigFile();
    }

    if (!config.autoCompile) {
      throw new Error(`ERROR: It seems the contract "${contractName}" has been edited since last compilation.\nYou can turn on "autoCompile" in config.json, compile it manually or ask the tests to be run on old version passing --old-build to the test command.`);
    }
 
    await compile({
      contract: contractName
    });
  }
};

const validateContract = async (contractName: string) => {
  if (!jestGlobal._checkedContracts) {
    jestGlobal._checkedContracts = {};
  }

  // Avoid re-doing checks if possible, will return previous results
  if (jestGlobal._checkedContracts[contractName]) {
    return jestGlobal._checkedContracts[contractName];
  }

  // If any of these checks fails, false will be stored in the cache
  jestGlobal._checkedContracts[contractName] = false;

  const sourcePath = bundle.getContractFile(contractName);
  if (!bundle.exists(sourcePath)) {
    throw new Error(`ERROR: Specified contract "${contractName}" doesn't exist.`);
  }

  if (!bundle.buildFileExists(contractName)) {
    throw new Error(`ERROR: Specified contract "${contractName}" has never been compiled.`);
  }

  const contract = await bundle.readContract(contractName);
  const hash = bundle.generateHash(contract);

  const buildFile = await bundle.readBuildFile(contractName);

  switch(bundle.isBuildValid(sourcePath, hash, buildFile)) {
    case BuildErrorCodes.MICHELSON_MISSING: 
      throw new Error(`ERROR: Invalid contract "${contractName}", Michelson code is missing!`);
    case BuildErrorCodes.INVALID_HASH:
      await handleOutdatedBuildfile(contractName);
      break;
    case BuildErrorCodes.INVALID_SOURCE_PATH:
      throw new Error(`ERROR: The compiled version for "${contractName}" was compiled from a different source path "${buildFile.sourcePath}"!`);
    case true:
      break;
  }

  // Parse JSON-michelson
  let code: object[] = [];
  try {
    code = JSON.parse(buildFile.michelson);
  } catch (err) {
    throw new Error(`ERROR: Failed to parse JSON-Michelson for contract ${contractName}, given error was: ${err}`);
  }

  jestGlobal._checkedContracts[contractName] = code;

  return code;
};

const deployContract = async (contractName: string, storage: any, signer: TezosSigner = jestGlobal.tezosDefaultSigner) => {
  const code = await validateContract(contractName);
  if (!code) {
    throw new Error(`Unable to process contract ${contractName}, deploy failed.`);
  }

  // Set the correct deployer account
  _setSigner(signer);

  // Originate the contract
  try {
    const op = await Tezos.contract.originate({
      code,
      storage,
    });

    const res = await op.contract();
    return res;
  } catch (err) {
    throw new Error(`ERROR while deploying contract ${contractName}:\n\n\t${err.message}.\n\nPlease review test's storage configuration and make sure it matches contract's expected values.`);
  }
};

// Test util to map to LIGO's byte type
const toBytes = (str: string): string => Buffer.from(str, 'utf8').toString('hex');

// Tezos/contract base objects
jestGlobal.Tezos = Tezos;
jestGlobal.deployContract = deployContract;

//  Utils
jestGlobal.toBytes = toBytes;

// Extend jest timeout
jest.setTimeout(30000);
