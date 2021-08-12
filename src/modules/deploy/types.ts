import { ToolchainNetworks } from "../config";

export type DeployCommandOptions = {
  network: ToolchainNetworks;
  contract: string;
  oldBuild: boolean;
};