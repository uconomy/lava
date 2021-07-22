import { spawn } from "child_process";
import { debug, error, getCWD, log } from "../../console";
import { ContractsBundle } from "../bundle";
import { JestCommandOptions } from "./types";

const launchTests = async (options: JestCommandOptions): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const initMillis = (new Date()).getTime();

    const cwd = getCWD();

    const args = [
      "test",
    ];

    const npmJest = spawn("npm", args, { cwd });

    npmJest.on("close", async () => {
      const finishMillis = (new Date()).getTime();
      debug(`✅ Done in ${(finishMillis - initMillis) / 1000}s.`);

      resolve();
    });

    npmJest.stdout.on("data", (data) => {
      log(data.toString());
    });

    npmJest.stderr.on("data", (data) => {
      error(data.toString());
      reject(npmJest.stderr);
      process.exit(1);
    });
  });
};

export const testWithJest = async (bundle: ContractsBundle, options: JestCommandOptions) => {
  await launchTests(options);
};