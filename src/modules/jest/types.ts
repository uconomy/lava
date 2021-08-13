import { ToolchainNetworks } from "../config";
import { FaucetAccount } from "../tezos";

export type JestCommandOptions = {
  network: ToolchainNetworks.SANDBOX | ToolchainNetworks.TESTNET;
  deployedContracts?: { [filename: string]: string };
  oldBuild?: boolean;
  e2e?: boolean;
}

export type JestCommandEnv = NodeJS.ProcessEnv & {
  USE_OLD_BUILD: string;
  DEPLOYED_CONTRACTS?: string;
};

export type TezosSigner = string | FaucetAccount;

export type CustomJestGlobals = {
  tezosRPCNode: string;
  tezosDefaultSigner: TezosSigner;
  tezosToolchainNetwork: ToolchainNetworks.SANDBOX | ToolchainNetworks.TESTNET;
  tezosCWD: string;
  tezosDeployedContracts?: { [filename: string]: string };
};

export const isFaucet = (tezosDefaultSigner: string | FaucetAccount): tezosDefaultSigner is FaucetAccount => {
  return !!(tezosDefaultSigner as FaucetAccount).mnemonic;
}