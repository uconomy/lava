import { spawn } from "child_process";
import path from 'path';
import os from 'os';
import { debug, error, getCWD, log, warn } from "../../console";
import { ContractsBundle } from "../bundle";
import { ensureImageIsPresent } from "../docker";
import { isLigoVersionLT } from "./parameters";
import { BuildData, DEFAULT_LIGO_VERSION, LigoCompilerOptions, LIGOVersions } from "./types";

const _compileFile = async (contractFileName: string, ligoVersion: LIGOVersions, bundle: ContractsBundle): Promise<void> => {
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

    if (ligoVersion === 'next') {
      warn(`Your preference for the LIGO compiler version is set to "next", which might lead to non-working setups for three reasons:\n` +
      ` 1) LIGO compiler is downloaded during the project's initial setup. "next" was the latest available LIGO version during the first project setup on this machine. LIGO won't be updated automatically even if new releases are issued;\n`+
      ` 2) If the CLI interface of LIGO is changed, the toolchain might not be able to compile your contracts anymore;\n` +
      ` 3) Your contract's code might not be compatible with newer versions of the LIGO compiler.\n`+
      `\nPlease consider using a specific LIGO compiler version, editing the "ligoVersion" property in config.json. Last supported version is: ${DEFAULT_LIGO_VERSION}`);
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

    const isOldCLI = isLigoVersionLT(ligoVersion, LIGOVersions[".25"]);
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
      const message = data.toString();

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