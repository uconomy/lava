export enum LIGOVersions {
  'next'  = "next",
  '.20'   = "0.20.0",
  // '.19'   = "0.19.0", // Deprecated
  // '.18'   = "0.18.0", // Deprecated
}

export const MINIMUM_LIGO_VERSION = LIGOVersions[".20"];

export enum LIGOFlavors {
  PascaLIGO = 'pascaligo',
  CameLIGO = 'cameligo',
  ReasonLIGO = 'reasonligo',
  JsLIGO = 'jsligo',
}

export type LigoCompilerOptions = {
  ligoVersion: LIGOVersions;
  contract?: string;
}

export type BuildData = {
  contractName: string;
  sourcePath: string;
  hash: string;
  updatedAt: string;
  compiler: {
    name: "ligo";
    version: LIGOVersions;
  };
  michelson: string;
}