import { TezosProtocols } from "../tezos";

export type FlextesaTezosProtocol = {
  hash: string;
  prefix: string;
  kind: string;
}

export type FlextesaTezosProtocols = {
  [x in TezosProtocols]: FlextesaTezosProtocol;
}

export type FlextesaOptions = {
  host: string;
  port: number;
  protocol: TezosProtocols;
  genesisBlockHash: string;
}
