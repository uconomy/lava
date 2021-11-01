import { spawn } from "child_process";
import path from 'path';
import os from 'os';
import { debug, error, getCWD, log } from "../../console";
import { ContractsBundle } from "../bundle";
import { ensureImageIsPresent, handleDockerWarnings } from "../docker";
import { isLigoVersionLT } from "./parameters";
import { BuildData, LigoCompilerOptions, LIGOVersion } from "./types";

const _compileFile = async (contractFileName: string, ligoVersion: LIGOVersion, bundle: ContractsBundle): Promise<void> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const ligoImage = `ligolang/ligo:${ligoVersion}`;

    const image = await ensureImageIsPresent(ligoImage);
    if (!image) {
      error('Unable to find LIGO image, compilation failed.');
      return;
    }

    log(`🚀 Compiling contract "${contractFileName}"...`);

    debug("\t👓 Reading source...");
    const source = await bundle.readContract(contractFileName);
    debug("\t\t✅ Done.");

    if (source === "") {
      error('The specified contract file is empty, skipping compilation.');
      return;
    }

    const hash = bundle.generateHash(source);
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
    };

    const mappedFolder = os.platform() === "win32" ? '/cd' : cwd;

    /**
     * Handle both old (0.24.0) and new (0.25.0) LIGO CLI interfaces
     */
    const isOldCLI = isLigoVersionLT(ligoVersion, "0.25.0");
    const args = isOldCLI ? [
      "run",
      "--rm",
      "-v", `${cwd}:${mappedFolder}`,
      "-w", `${mappedFolder}`,
      ligoImage,
      "compile-contract",
      "--michelson-format=json",
      `${sourcePath}`,
      "main",
    ] : [
      "run",
      "--rm",
      "-v", `${cwd}:${mappedFolder}`,
      "-w", `${mappedFolder}`,
      ligoImage,
      "compile", "contract",
      `${sourcePath}`,
      "-e", "main",
      "--michelson-format", "json",
    ];

    debug(`\t🔥 Compiling with LIGO (${ligoVersion})...`);
    debug(`\t   Running LIGO compile command:\ndocker ${args.join(' ')}`);

    const ligo = spawn("docker", args, {});

    ligo.on("close", async () => {
      debug("\t\t✅ Done.");

      const outFile = bundle.getBuildFile(contractFileName);

      debug(`\t📦 Writing output file "${path.relative(cwd,outFile)}"...`);
      await bundle.writeBuildFile(contractFileName, built);
      debug("\t\t✅ Done.");

      debug("\t🥖 Contract compiled succesfully.");

      resolve();
    });

    ligo.stdout.on("data", (data) => {
      built.michelson += data.toString();
    });

    ligo.stderr.on("data", (data) => {
      const message: string = data.toString();
  
      const hasWarnings = handleDockerWarnings(message);
      if (hasWarnings) {
        return;
      }
      
      error(message);
      reject(ligo.stderr);
      process.exit(1);
    });
  });
};

export const compileWithLigo = async (bundle: ContractsBundle, options: LigoCompilerOptions): Promise<void> => {
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