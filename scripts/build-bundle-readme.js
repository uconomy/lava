
const { readTextFile, contractFolder, contractBundlePath, initBundlePath, writeTextFile } = require("./resources");

(async () => {
  const src = contractBundlePath("README.md");

  const content = await readTextFile(src);
  const stringifiedContent = content.replace(/`/g, '\\\`');

  const dest = initBundlePath("make-readme.ts");

  const data = 
`import { Bundle } from "../../../bundle";

export const makeREADME = (bundle: Bundle) =>
\`${stringifiedContent}
\`;
`;

  writeTextFile(dest, data);
})()