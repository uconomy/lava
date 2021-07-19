import { spawn, execSync } from "child_process";
import crypto from 'crypto';
import { em, error, log, debug, getCWD, warn } from "../../console";
import fs from 'fs';
import path from 'path';
import { BuildData, LigoCompilerOptions, LIGOVersions } from "./types";
import { ContractsBundle } from "../bundle";
import { isLigoVersionLT } from "./parameters";

const _getHash = (source: string) => {
  const hash = crypto.createHash('sha256');
  
  hash.update(source);
  return hash.digest('hex');
};

const _compileFile = async (contractFileName: string, ligoVersion: LIGOVersions, bundle: ContractsBundle): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    log(`🚀 Compiling contract "${contractFileName}"...`);

    debug("\t👓 Reading source...");
    const source = await bundle.readContract(contractFileName);
    const hash = _getHash(source);
    debug("\t\t✅ Done.");

    const sourcePath = bundle.getContractFile(contractFileName);

    if (bundle.buildFileExists(contractFileName)) {
      const oldBuildFile = await bundle.readBuildFile(contractFileName);

      if (oldBuildFile.sourcePath !== sourcePath) {
        error(`There is a compiled version of a contract with the same name which code is located at:\n\n${oldBuildFile.sourcePath}`);
        return;
      }

      if (oldBuildFile.hash === hash) {
        log("\tNo changes were made to this contract, skipping compilation.");
        return;
      }

      if (isLigoVersionLT(ligoVersion, oldBuildFile.compiler.version)) {
        error(`You are trying to recompile a smart contract with an earlier version of LIGO. This is forbidden, but you can force this passing -f to compile command.`);
        return;
      }
    }

    const cwd = getCWD();

    const built: BuildData = {
      contractName: contractFileName,
      sourcePath: sourcePath,
      hash: hash,
      updatedAt: (new Date()).toISOString(),
      compiler: {
        name: "ligo",
        version: ligoVersion,
      },
      michelson: "",
      // abi: [],
      // source,
      // networks: {},
      // schemaVersion: "3.2.0-tezos.1",
      // networkType: "tezos",
    };

    const args = [
      "run",
      "--rm",
      "-v", `${cwd}:${cwd}`,
      "-w", `${cwd}`,
      `ligolang/ligo:${ligoVersion}`,
      "compile-contract",
      "--michelson-format=json",
      `${sourcePath}`,
      "main",
    ];

    debug(`\t🔥 Compiling with LIGO (${ligoVersion})...`);
    const ligo = spawn("docker", args, {});

    ligo.on("close", async () => {
      debug("\t\t✅ Done.");

      // const outFile = path.join(...BUILD_FOLDER, `${contract}.json`);
      // const buildFolder = path.dirname(outFile);

      // if (!fs.existsSync(buildFolder)) {
      //   let dirPath = ".";
      //   for (const folder of BUILD_FOLDER) {
      //     dirPath = path.join(dirPath, folder);
      //     execSync(`mkdir ${dirPath}`);
      //   }
      // }

      const outFile = bundle.getBuildFile(contractFileName);

      debug(`\t📦 Writing output file "${path.relative(cwd,outFile)}"...`);
      // fs.writeFileSync(outFile, JSON.stringify(built, null, 2));
      await bundle.writeBuildFile(contractFileName, built);
      debug("\t\t✅ Done.");

      debug("\t🥖 Contract compiled succesfully.");

      resolve();
    });

    ligo.stdout.on("data", (data) => {
      built.michelson += data.toString();
    });

    ligo.stderr.on("data", (data) => {
      error(data.toString());
      reject(ligo.stderr);
      process.exit(1);
    });
  });
};

export const compileWithLigo = async (bundle: ContractsBundle, options: LigoCompilerOptions) => {
  const config = bundle.config;

  // Check the existence of build folder
  if (!bundle.exists(config.outputDirectory)) {
    log(`Creating output directory "${config.outputDirectory}" since it was not present.`);

    await bundle.makeDir(config.outputDirectory);
  }

  // Either build all the contracts in config.contractsDirectory or the specified contract
  if (options.contract) {
    await _compileFile(options.contract, options.ligoVersion, bundle);
  } else {
    const contracts = await bundle.getContractsFiles();

    for (const contract of contracts) {
      await _compileFile(contract, options.ligoVersion, bundle);
    }
  }
};