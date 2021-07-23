import chalk from "chalk";
import { spawn } from "child_process";
import { debug, getCWD } from "../../console";
import { ContractsBundle } from "../bundle";
import { JestCommandOptions } from "./types";

const launchTests = async (options: JestCommandOptions): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const initMillis = (new Date()).getTime();

    const cwd = getCWD();

    const args = [
      "--colors",
    ];

    console.log(chalk.reset());
    const npmJest = spawn("jest", args, { cwd });

    npmJest.on("close", async (code: number | null) => {
      if (code) {
        process.exit(code);
      } 

      const finishMillis = (new Date()).getTime();
      debug(`✅ Testing process done in ${(finishMillis - initMillis) / 1000} s.`);

      // resolve();
      process.exit(0);
    });

    npmJest.stdout.on("data", (data) => {
      process.stdout.write(data);
    });

    npmJest.stderr.on("data", (data) => {
      process.stderr.write(data);
    });
  });
};

export const testWithJest = async (bundle: ContractsBundle, options: JestCommandOptions) => {
  await launchTests(options);
};