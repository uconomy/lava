import { Bundle } from "./bundle";

export class ContractsBundle extends Bundle {
  constructor(basePath: string = process.cwd()) {
    

    super("", basePath);
  }

  async getContracts() {

  }
}