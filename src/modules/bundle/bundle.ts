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

export const readJSONFile = async (path: string): Promise<any> =>
  JSON.parse(await readTextFile(path));

export const mkdir = async (path: string): Promise<true> => 
  new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => err ? reject(err) : resolve(true));
  });

export const listFiles = async (path: string, options?: BufferEncoding | {
  encoding: BufferEncoding | null;
  withFileTypes?: false | undefined;
}) => new Promise((resolve, reject) => {
  fs.readdir(path, options, (err, files) => {
    err ? reject(err) : resolve(files);
  });
});

export const makeDomainName = (name: string) => (
  name.toLocaleLowerCase().replace(/\s/g, '-') // TODO: Remove non alphanumeric chars replace(//g, '')
);


export class Bundle {
  readonly name: string;
  readonly domainName: string;
  readonly basePath: string;

  constructor(name: string, basePath: string = process.cwd()) {
    this.name = name;
    this.domainName = makeDomainName(name);
    this.basePath = basePath;

    if (!fs.existsSync(basePath))
      throw new Error("Invalid base path provided to Bundle: folder does not exist.");

    this.basePath = path.join(basePath, this.domainName);

    if (fs.existsSync(this.basePath))
      throw new Error("Bundle complete path (base path + name) already exists.");

    fs.mkdirSync(this.basePath);
  }

  getPath(name: string) {
    return path.join(this.basePath, name);
  }

  async writeTextFile(filePath: string, data: string, encoding: BufferEncoding = 'utf-8') {
    return writeTextFile(this.getPath(filePath), data, encoding);
  }

  async readTextFile(filePath: string, data: string, encoding: BufferEncoding = 'utf-8') {
    return readTextFile(this.getPath(filePath), encoding);
  }

  async writeJSONFile(filePath: string, data: any, beautify: boolean = true) {
    return writeJSONFile(this.getPath(filePath), data, beautify);
  }

  async readJSONFile(filePath: string) {
    return readJSONFile(this.getPath(filePath));
  }

  async makeDir(folderPath: string) {
    return mkdir(this.getPath(folderPath));
  }

  async listFiles(folderPath: string) {
    return listFiles(this.getPath(folderPath));
  }
}