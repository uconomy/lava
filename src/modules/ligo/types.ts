export enum LIGOVersions {
  'next'  = "next",
  '.20'   = "0.20.0",
  // '.19'   = "0.19.0",
  // '.18'   = "0.18.0",
}

export enum LIGOFlavors {
  PascaLIGO = 'pascaligo',
  CameLIGO = 'cameligo',
  ReasonLIGO = 'reasonligo',
  JsLIGO = 'jsligo',
}

export type LigoCompilerOptions = {
  ligoVersion: LIGOVersions;
}
