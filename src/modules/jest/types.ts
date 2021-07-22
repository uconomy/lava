import { ToolchainNetworks } from "../config";
import { FaucetAccount } from "../tezos";

export type JestCommandOptions = {
  network: ToolchainNetworks.SANDBOX | ToolchainNetworks.TESTNET;
}

export type TezosSigner = string | FaucetAccount;

export type CustomJestGlobals = {
  tezosRPCNode: string;
  tezosDefaultSigner: TezosSigner;
  tezosToolchainNetwork: ToolchainNetworks.SANDBOX | ToolchainNetworks.TESTNET;
  tezosCWD: string;
};

export const isFaucet = (tezosDefaultSigner: string | FaucetAccount): tezosDefaultSigner is FaucetAccount => {
  return !!(tezosDefaultSigner as FaucetAccount).mnemonic;
}