export type LIGOVersion = string;

export const MINIMUM_LIGO_VERSION = "0.24.0";
export const DEFAULT_LIGO_VERSION = "0.27.0";

export enum LIGOFlavors {
  PascaLIGO = 'pascaligo',
  CameLIGO = 'cameligo',
  ReasonLIGO = 'reasonligo',
  JsLIGO = 'jsligo',
}

export type LigoCompilerOptions = {
  ligoVersion: LIGOVersion;
  contract?: string;
}

export type BuildData = {
  contractName: string;
  sourcePath: string;
  hash: string;
  updatedAt: string;
  compiler: {
    name: "ligo";
    version: LIGOVersion;
  };
  michelson: string;
}