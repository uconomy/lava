import { spawn, execSync } from "child_process";
import { em, error, log, debug } from "../../console";
import { defaultConfig } from "../config";
import { TezosProtocols } from "../tezos";
import { createAccountsParams, createProtocolParams, flextesaProtocols } from "./parameters";
import { FlextesaOptions } from "./types";

// Name for the running Docker image
export const POD_NAME = 'flextesa-sandbox';

const defaultProtocol = TezosProtocols.FLORENCE;
const defaultOptions: FlextesaOptions = defaultConfig.sandbox;

// This is to avoid printing flextesa full-console in output
const startLine = "Flextesa: Please enter command:";

export const startFlextesa = (_options: Partial<FlextesaOptions>, readyCallback?: () => void): void => {
  log(`Preparing Flextesa sandbox...`);

  // Merge with defaults
  const options = Object.assign({}, defaultOptions, _options);

  // Localhost is not a valid host for Docker
  const host = options.host === "localhost" ? "0.0.0.0" : options.host;
  const port = options.port;

  // Protocol "validity" checks
  const protocol = (!options.protocol || !flextesaProtocols[options.protocol])
    ? defaultProtocol
    : options.protocol;

  const accountsParams = createAccountsParams(options.accounts || {});
  const tezosNodeParams = createProtocolParams(protocol);

  const args = [
    "run",
    "-i",
    "--rm",
    "--name",
    POD_NAME,
    "-p",
    host + ":" + port + ":20000",
    "tqtezos/flextesa:20210602",
    "flextesa",
    "mini-net",
    "--genesis-block-hash", options.genesisBlockHash,
    // "--remove-default-bootstrap-accounts"
    /**
     * Please don't use --remove-default-bootstrap-accounts in conjunction with
     * --no-daemons-for on every added account. This would have Flextesa not baking
     * anything, so the header block would be empty and Taquito does not really like it!
     */
    "--time-between-blocks", "2",
    "--minimal-block-delay", "1",
    "--pause-on-error=true",
    ...accountsParams,
    ...tezosNodeParams
  ];
  const opts = {};

  debug(`Starting Flextesa with these arguments:`);
  debug("docker " + args.join(' '));

  const flextesa = spawn("docker", args, opts);

  // Setup listeners for errors and close listeners to handle crashed during Flextesa boot
  let stderr = "";
  function onErrored(err: Error) {
    flextesa.removeListener("close", onClosed);
    stopFlextesa();
    
    throw err;
  }
  function onClosed(code: number) {
    flextesa.removeListener("error", onErrored);
    stopFlextesa();

    if (code !== 0) {
      throw new Error(stderr);
    }
  }
  flextesa.on("error", onErrored);
  flextesa.on("close", onClosed);

  flextesa.stderr.on("data", function fn(data) {
    const str = data.toString();
    stderr += str;
    
    // Print every message apart from "Flextesa: Please enter command:"
    if (!str.includes(startLine)) {
      debug(str);
    } else { // But when we reach it, Flextsa is ready
      stderr = "";

      // unbind the now unused listeners for boot problems...
      flextesa.removeListener("close", onClosed);
      flextesa.removeListener("error", onErrored);
      flextesa.stderr.removeListener("data", fn);

      // Print general output
      flextesa.stdout.on("data", (data) => {
        debug(data.toString());
      });

      // Print standard flextesa output
      flextesa.stderr.on("data", (data) => {
        const str = data.toString();
        error(str.replace(startLine, ""));
      });

      em(`Tezos sandbox is ready!`);

      if (readyCallback) {
        readyCallback();
      }
    }
  });
};

export const stopFlextesa = (callback?: () => void): void => {
  try {
    execSync(`docker rm -f ${POD_NAME}`);
  } catch (e) {
    error('Stopping Flextesa thrown:', e);
  }

  callback && callback();
};

export const isFlextesaRunning = async (): Promise<boolean> => {
  try {
    const buffer = execSync(`docker ps -f name=${POD_NAME} -q`);

    return buffer.length !== 0;
  } catch (e) {
    return false;
  }
};