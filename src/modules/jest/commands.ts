import chalk from "chalk";
import path from "path";
import { spawn } from "child_process";
import { debug, error, getCWD } from "../../console";
import { ContractsBundle } from "../bundle";
import { JestCommandEnv, JestCommandOptions } from "./types";

const launchTests = async (options: JestCommandOptions): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const initMillis = (new Date()).getTime();

    const cwd = getCWD();

    const args = [
      "--colors",
    ];

    const env: JestCommandEnv = {
      ...process.env,
      USE_OLD_BUILD: options.oldBuild ? 'true' : 'false',
    };

    console.log(chalk.reset());
    try {
      const npmJest = spawn("jest", args, { cwd, env });

      npmJest.on('error', (err) => {
        error(`ERROR Starting Jest: ${err}`);
      })

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
    } catch (err) {
      error(`ERROR Starting Jest, ${err}`);
    }
  });
};

export const testWithJest = async (bundle: ContractsBundle, options: JestCommandOptions) => {
  await launchTests(options);
};