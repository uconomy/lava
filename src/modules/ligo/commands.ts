import { spawn, execSync } from "child_process";
import { em, error, info, log } from "../../console";
import fs from 'fs';

const compileFile = async (file: string) => {
  // return new Promise((resolve, reject) => {
  //   if (!fs.existsSync(file)) {
  //     throw new Error(`Unable to find contract "${file}": file does not exist!`);
  //   }

  //   console.log(`🚀 Compiling contract "${file}"...`);

  //   console.log("\t👓 Reading source...");
  //   const source = fs.readFileSync(file).toString();
  //   console.log("\t\t✅ Done.");

  //   const PWD = process.cwd();

  //   const built = {
  //     contractName: contract,
  //     abi: [],
  //     michelson: "",
  //     source,
  //     sourcePath: path.join(PWD, contractFile),
  //     compiler: {
  //       name: "ligo",
  //       version: params.version,
  //     },
  //     networks: {},
  //     schemaVersion: "3.2.0-tezos.1",
  //     updatedAt: (new Date()).toISOString(),
  //     networkType: "tezos",
  //   };

  //   const args = [
  //     "run",
  //     "--rm",
  //     "-v", `${PWD}:${PWD}`,
  //     "-w", `${PWD}`,
  //     `ligolang/ligo:${params.version}`,
  //     "compile-contract",
  //     "--michelson-format=json",
  //     `./${contractFile}`,
  //     "main",
  //   ];

  //   console.log(`\t🔥 Compiling with LIGO (${params.version})...`);
  //   const ligo = spawn("docker", args, {});

  //   ligo.on("close", () => {
  //     console.log("\t\t✅ Done.");

  //     const outFile = path.join(...BUILD_FOLDER, `${contract}.json`);
  //     const buildFolder = path.dirname(outFile);

  //     if (!fs.existsSync(buildFolder)) {
  //       let dirPath = ".";
  //       for (const folder of BUILD_FOLDER) {
  //         dirPath = path.join(dirPath, folder);
  //         execSync(`mkdir ${dirPath}`);
  //       }
  //     }

  //     console.log(`\t📦 Writing output file "${outFile}"...`);
  //     fs.writeFileSync(outFile, JSON.stringify(built, null, 2));
  //     console.log("\t\t✅ Done.");

  //     console.log("\t🥖 Contract compiled succesfully.");

  //     resolve();
  //   });

  //   ligo.stdout.on("data", (data) => {
  //     built.michelson += data.toString();
  //   });

  //   ligo.stderr.on("data", (data) => {
  //     console.error(data.toString());
  //     // reject(ligo.stderr);
  //     process.exit(1);
  //   });
  // });
};