export enum TezosProtocols {
  CARTHAGE = 'carthage',
  DELPHI = 'delphi',
  EDO = 'edo',
  FLORENCE = 'florence',
  GRANADA = 'granada',
  HANGZHOU = 'hangzhou',
  ITHACA = 'ithaca',
}

export type FaucetAccount = {
  mnemonic: string[];
  activation_code: string;
  amount: string; // mutez
  pkh: string;
  password?: string;
  email: string;
};