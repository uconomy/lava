import { spawn, spawnSync } from "child_process";
import { debug, error, log, warn } from "../../console";

export const DOCKER_WARNING = /(?<=warning: ).+/igm;

export const hasImage = (imageName: string): boolean => {
  try {
    const args = [
      'inspect',
      '--type=image',
      imageName,
    ];
    const docker = spawnSync("docker", args);

    // if (docker.status == 0) {
    //   return true;
    // } else {
    //   const error = docker.output[2].toString();

    //   if (error.startsWith(`Error: No such image: ${imageName}`)) {
    //     console.log('Image not present');
    //   }

    //   return false;
    // }

    return docker.status === 0;
  } catch(err) {
    error(err);

    return false;
  }
};

export const pullImage = (imageName: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const args = [
      'pull',
      imageName,
    ];

    const docker = spawn("docker", args, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });

    docker.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject();
      }
    });
  });
};

export const ensureImageIsPresent = async (imageName: string): Promise<boolean> => {
  const image = hasImage(imageName);

  if (!image) {
    log(`Docker image "${imageName}" was not found, pulling...`);
    const res = await pullImage(imageName);
    if (res) {
      log("Download completed.\n");
    } else {
      error("Download failed");
    }

    return res;
  } else {
    debug(`Docker image "${imageName}" found.`);
  }

  return true;
};

export const handleDockerWarnings = (message: string, warnFn: (...args: unknown[]) => void = warn): boolean => {
  const warnings = message.match(DOCKER_WARNING);
  if (warnings?.length) {
    for (const wMessage of warnings) {
      warnFn(`Warning: ${wMessage}`);
    }

    return true;
  }

  return false;
}