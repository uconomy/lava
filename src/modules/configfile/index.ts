export enum LIGOFlavors {
  PascaLIGO = 'pascaligo',
  CameLIGO = 'cameligo',
  ReasonLIGO = 'reasonligo',
  JsLIGO = 'jsligo',
}

export class ConfigFile {
  contractName: string = "UntitledContract";
  ligoFlavor: LIGOFlavors = LIGOFlavors.PascaLIGO;

}