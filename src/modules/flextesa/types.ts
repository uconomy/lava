import { TezosProtocols } from "../tezos";

export type FlextesaTezosProtocol = {
  hash: string;
  prefix: string;
  kind: string;
}

export type FlextesaTezosProtocols = {
  [x in TezosProtocols]: FlextesaTezosProtocol;
}

export type FlextesaAccounts = {
  [accountName: string]: {
    pkh: string;
    sk: string;
    pk: string;
  };
};

export type FlextesaOptions = {
  host: string;
  port: number;
  protocol: TezosProtocols;
  genesisBlockHash: string;
  accounts?: FlextesaAccounts;
}
