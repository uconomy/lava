import fs from 'fs';
import path from 'path';

export const writeTextFile = async (path: string, data: string, encoding: BufferEncoding = 'utf-8'): Promise<true> => 
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, { encoding }, (err) => err ? reject(err) : resolve(true));
  });

export const readTextFile = async (path: string, encoding: BufferEncoding = 'utf-8'): Promise<string> => 
  new Promise((resolve, reject) => {
    fs.readFile(path, { encoding }, (err, data) => err ? reject(err) : resolve(data));
  });

export const writeJSONFile = async (path: string, data: any, beautify: boolean = true) => 
  writeTextFile(path, beautify ? JSON.stringify(data, null, 2) : JSON.stringify(data));

export const readJSONFile = async <T = any>(path: string): Promise<T> =>
  JSON.parse(await readTextFile(path));

export const mkdir = async (path: string): Promise<true> => 
  new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => err ? reject(err) : resolve(true));
  });

export const listFiles = async (path: string, options?: BufferEncoding | {
  encoding: BufferEncoding | null;
  withFileTypes?: false | undefined;
}): Promise<string[]> => new Promise((resolve, reject) => {
  fs.readdir(path, options, (err, files) => {
    err ? reject(err) : resolve(files);
  });
});

export const createBundle = async (folder: string, basePath: string): Promise<Bundle> => {
  if (!fs.existsSync(basePath))
    throw new Error("Invalid base path provided for creating Bundle: folder does not exist.");

  const bundleBasePath = path.join(basePath, folder);
  
  if (fs.existsSync(bundleBasePath))
    throw new Error("A folder with that name already exists!");

  await mkdir(bundleBasePath);

  return new Bundle(bundleBasePath);
};

export class Bundle {
  readonly basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;

    if (!fs.existsSync(basePath))
      throw new Error("Invalid base path provided to Bundle: folder does not exist.");
  }

  getPath(...name: string[]) {
    return path.resolve.apply(this, [this.basePath, ...name]);
  }

  async writeTextFile(filePath: string, data: string, encoding: BufferEncoding = 'utf-8') {
    return writeTextFile(this.getPath(filePath), data, encoding);
  }

  async readTextFile(filePath: string, encoding: BufferEncoding = 'utf-8') {
    return readTextFile(this.getPath(filePath), encoding);
  }

  async writeJSONFile(filePath: string, data: any, beautify: boolean = true) {
    return writeJSONFile(this.getPath(filePath), data, beautify);
  }

  async readJSONFile<T>(filePath: string) {
    return readJSONFile<T>(this.getPath(filePath));
  }

  exists(path: string) {
    return fs.existsSync(this.getPath(path));
  }

  async makeDir(folderPath: string) {
    return mkdir(this.getPath(folderPath));
  }

  async listFiles(folderPath: string) {
    return listFiles(this.getPath(folderPath));
  }
}