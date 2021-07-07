export enum LIGOFlavors {
  PascalLIGO = 'pascaligo',
  CamelLIGO = 'cameligo',
  ReasonLIGO = 'reasonligo',
  JSLIGO = 'jsligo',
}

export class ConfigFile {
  contractName: string = "UntitledContract";
  ligoFlavor: LIGOFlavors = LIGOFlavors.PascalLIGO;

}