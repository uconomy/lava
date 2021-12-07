import { spawn, execSync } from "child_process";
import { em, error, log, debug, warn } from "../../console";
import { defaultConfig } from "../config";
import { ensureImageIsPresent, handleDockerWarnings } from "../docker";
import { TezosProtocols } from "../tezos";
import { createAccountsParams, createProtocolParams, flextesaProtocols } from "./parameters";
import { FlextesaOptions } from "./types";

// Flextesa image
const FLEXTESA_IMAGE = "registry.gitlab.com/smondet/flextesa:68d674f9-run"; //"tqtezos/flextesa:20211119";// "registry.gitlab.com/smondet/flextesa:017a2264-run";

// Name for the running Docker image
export const POD_NAME = 'flextesa-sandbox';

const defaultProtocol = TezosProtocols.GRANADA;
const defaultOptions: FlextesaOptions = defaultConfig.sandbox;

// This is to avoid printing flextesa full-console in output
const FLEXTESA_INPUT_COMMAND = "Flextesa: Please enter command:";
const FLEXTESA_MESSAGE_HEADER = /Flextesa:\n/igm;
const FLEXTESA_WARNING = /.+(?<=warning:( )*(\n)*).+/igm;
const FLEXTESA_ERROR = /.+(?<=(fatal-error:|error:)( )*(\n)*).+/igm;
const FLEXTESA_EXIT = "Last pause before the application will Kill 'Em All and Quit.";

const hasFlextesaMessage = (message: string) => {
  const hasHeader = message.match(FLEXTESA_MESSAGE_HEADER)

  return !!hasHeader && hasHeader.length > 0
}

const handleFlextesaMessages = (str: string): boolean => {
  const message = str.replace(FLEXTESA_MESSAGE_HEADER, '')

  if (message.includes(FLEXTESA_EXIT)) {
    error("Flextesa failed to start all the needed services, now forcing shutdown...")
    // stopFlextesa();

    return true
  }

  const lines = message.split('\n')

  const output: {
    fn?: (...args: string[]) => void,
    msg: string
  }[] = [];

  const l = (msg: string, fn?: (...args: string[]) => void) => ({ fn, msg })
  let globalRenderer = debug

  for (const line of lines) {
    const warnings = line.match(FLEXTESA_WARNING)
    const errors = line.match(FLEXTESA_ERROR)

    if (errors?.length) {
      for(const err of errors) {
        output.push(l(err, error))
      }

      globalRenderer = error
    }

    if (warnings?.length) {
      for(const warning of warnings) {
        output.push(l(warning, warn))
      }

      if (globalRenderer !== error) {
        globalRenderer = warn
      }
    }

    if (!warnings?.length && !errors?.length) {
      output.push(l(line))
    }
  }

  for (const log of output) {
    const msg = log.msg.replace('\t', '')

    if (log.fn) {
      log.fn(msg)
    } else {
      globalRenderer(msg)
    }
  }

  return false
};

export const startFlextesa = async (_options: Partial<FlextesaOptions>, readyCallback?: () => void): Promise<void> => {
  log(`Preparing Flextesa sandbox...`);

  const image = await ensureImageIsPresent(FLEXTESA_IMAGE);
  if (!image) {
    error('Unable to find Flextesa image, compilation failed.');
    return;
  }


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
    "--env", "flextesa_node_cors_origin=*",
    FLEXTESA_IMAGE,
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
    // "--minimal-block-delay", "1",
    "--pause-on-error=true",
    ...accountsParams,
    ...tezosNodeParams
  ];
  const opts = {};

  debug(`Starting Flextesa with these arguments:`);
  debug("docker " + args.join(' '));

  const flextesa = spawn("docker", args, opts);
  let shouldStopLogging = false

  // Setup listeners for errors and close listeners to handle crashed during Flextesa boot
  let stderr = "";
  function onErrored(err: Error) {
    error("Flextesa running failed with:", err.message);

    flextesa.removeListener("close", onClosed);
    stopFlextesa();
    
    throw err;
  }
  async function onClosed(code: number) {
    flextesa.removeListener("error", onErrored);

    if (await isFlextesaRunning()) {
      stopFlextesa();
    }

    if (code !== 0) {
      error(`Flextesa exited with code ${code}.`);
    }
  }
  flextesa.on("error", onErrored);
  flextesa.on("close", onClosed);

  flextesa.stderr.on("data", function fn(data) {
    const str = data.toString();
    stderr += str;

    if (shouldStopLogging) {
      stderr = "";
      return
    }
    
    // Print every message as it is, apart from flextesa warnings, errors and input command
    if (hasFlextesaMessage(str)) {
      shouldStopLogging = handleFlextesaMessages(str)
    } else if (!str.startsWith(FLEXTESA_INPUT_COMMAND)) {
        // Let docker lib handle warnings
        const hasWarnings = handleDockerWarnings(str);

        // if warnings weren't there, just print the messages
        if (!hasWarnings) {
          debug(str);
        }
    } else { // But when we reach it, Flextsa is ready
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        error(str.replace(FLEXTESA_INPUT_COMMAND, ""));
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