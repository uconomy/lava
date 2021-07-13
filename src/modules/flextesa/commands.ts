import { spawn, execSync } from "child_process";
import { em, error, info, log } from "../../console";
import { TezosProtocols } from "../tezos";
import { createAccountsParams, createProtocolParams, flextesaProtocols } from "./parameters";
import { FlextesaOptions } from "./types";

let accounts = [];
try {
  accounts = require("../sandbox/accounts");
} catch (err) {}

const defaultProtocol = TezosProtocols.FLORENCE;
const defaultOPtions: FlextesaOptions = {
  host: "0.0.0.0",
  port: 20000,
  protocol: defaultProtocol,
  genesisBlockHash: "random"
};

// This is to avoid printing flextesa full-console in output
const startLine = "Flextesa: Please enter command:";

let closed = true;

export const startFlextesa = (_options: Partial<FlextesaOptions>) => {
  info`Preparing Flextesa sandbox...`;

  // Merge with defaults
  const options = Object.assign({}, defaultOPtions, _options);

  // Localhost is not a valid host for Docker
  const host = options.host === "localhost" ? "0.0.0.0" : options.host;
  const port = options.port;

  // Protocol "validity" checks
  const protocol = (!options.protocol || !flextesaProtocols[options.protocol])
    ? defaultProtocol
    : options.protocol;

  const accountsParams = createAccountsParams([]);
  const tezosNodeParams = createProtocolParams(protocol);

  const args = [
    "run",
    "-i",
    "--rm",
    "--name",
    "my-sandbox",
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
    "--time-between-blocks", "1",
    "--pause-on-error=true",
    ...accountsParams,
    ...tezosNodeParams
  ];
  const opts = {};

  log`Starting Flextesa with these arguments:`;
  log("docker " + args.join(' '));

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
      log(str);
    } else { // But when we reach it, Flextsa is ready
      stderr = "";
      closed = false;

      // unbind the now unused listeners for boot problems...
      flextesa.removeListener("close", onClosed);
      flextesa.removeListener("error", onErrored);
      flextesa.stderr.removeListener("data", fn);

      // Append official close listener now
      flextesa.on("close", () => {
        closed = true;
      });

      // Print general output
      flextesa.stdout.on("data", (data) => {
        log(data.toString());
      });

      // Print standard flextesa output
      flextesa.stderr.on("data", (data) => {
        const str = data.toString();
        error(str.replace(startLine, ""));
      });

      em`Tezos sandbox is ready!`;
    }
  });
};

const stopFlextesa = async (callback?: () => void) => {
  closed = true;

  try {
    execSync("docker rm -f my-sandbox");
  } catch (e) {}

  callback && callback();
};
