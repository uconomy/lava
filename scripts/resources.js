const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const contractBundleFolder = path.join(cwd, 'contract-bundle');
const bundleFolder = path.join(cwd, 'src', 'commands', 'init', 'contract-bundle');

const writeTextFile = async (path, data, encoding = 'utf-8') => 
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, { encoding }, (err) => err ? reject(err) : resolve(true));
  });

const readTextFile = async (path, encoding = 'utf-8') => 
  new Promise((resolve, reject) => {
    fs.readFile(path, { encoding }, (err, data) => err ? reject(err) : resolve(data));
  });

const writeJSONFile = async (path, data, beautify = true) => 
  writeTextFile(path, beautify ? JSON.stringify(data, null, 2) : JSON.stringify(data));

const readJSONFile = async (path) =>
  JSON.parse(await readTextFile(path));

const contractBundlePath = (fileName) => path.join(contractBundleFolder, fileName);
const initBundlePath = (fileName) => path.join(bundleFolder, fileName);

module.exports = {
  writeTextFile,
  readTextFile,
  writeJSONFile,
  readJSONFile,
  contractBundlePath,
  initBundlePath
};
