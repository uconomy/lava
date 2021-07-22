import fs from 'fs';
import { TezosToolkit, ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { InMemorySigner, importKey } from "@taquito/signer";
import { CustomJestGlobals, isFaucet, TezosSigner } from './types';
import { ContractsBundle } from '../bundle';
import { error } from '../../console';

type AugmentedJestGlobal = {
  Tezos: TezosToolkit;
  deployContract(contractName: string, storage: any, signer: TezosSigner): Promise<ContractAbstraction<ContractProvider>>;

  toBytes(str: string): string;
}

// This is needed to infer a type to Jest context's global variable
const jestGlobal = global as unknown as CustomJestGlobals & AugmentedJestGlobal;

// Setup the basic Taquito client
const Tezos = new TezosToolkit(jestGlobal.tezosRPCNode);

// Internal functions
const _setSigner = (signer: TezosSigner) => {
  if (isFaucet(signer)) {
    importKey(Tezos, signer.email, signer.password, signer.mnemonic, signer.secret);

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

const deployContract = async (contractName: string, storage: any, signer: TezosSigner = jestGlobal.tezosDefaultSigner) => {
  if (!fs.existsSync(bundle.getBuildFile(contractName))) {
    throw new Error(`ERROR: Specified contract "${contractName}" doesn't exist.`);
  }

  const contract = await bundle.readBuildFile(contractName);
  const michelson = contract.michelson;
  if (!michelson) {
    throw new Error(`ERROR: Invalid contract "${contractName}", Michelson code is missing!`);
  }

  // Parse JSON-michelson
  let code: object[] = [];
  try {
    code = JSON.parse(michelson);
  } catch (err) {
    throw new Error(`ERROR: Failed to parse JSON-Michelson for contract ${contractName}, given error was: ${err}`);
  }

  // Set the correct deployer account
  _setSigner(signer);

  // Originate the contract
  const op = await Tezos.contract.originate({
    code,
    storage,
  });

  const res = await op.contract();
  return res;
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
