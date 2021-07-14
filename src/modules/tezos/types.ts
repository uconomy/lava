export enum TezosProtocols {
  CARTHAGE = 'carthage',
  DELPHI = 'delphi',
  EDO = 'edo',
  FLORENCE = 'florence',
  GRANADA = 'granada',
}

export type FaucetAccount = {
  mnemonic: string[15];
  secret: string;
  amount: string; // mutez
  pkh: string;
  password: string;
  email: string;
};