import { DEFAULT_LIGO_VERSION, LIGOVersion } from "./types";
import { SemVer } from 'semver';
import { warn } from "../../console";

export const isLigoVersionLT = (compare: LIGOVersion, to: LIGOVersion): boolean => {
  if (compare === 'next') {
    return false;
  }

  const sCompare = new SemVer(compare);
  const sTo = new SemVer(to);

  return sCompare.compare(sTo) === -1;
};

export const isLigoVersionGT = (compare: LIGOVersion, to: LIGOVersion): boolean => {
  if (to === 'next') {
    return false;
  }

  const sCompare = new SemVer(compare);
  const sTo = new SemVer(to);

  return sCompare.compare(sTo) === 1;
};

export const toLigoVersion = (version: string): LIGOVersion => {
  if (version === 'next') {
    warn(`Your preference for the LIGO compiler version is set to "next", which might lead to non-working setups for three reasons:\n` +
      ` 1) LIGO compiler is downloaded during the project's initial setup. "next" was the latest available LIGO version during the first project setup on this machine. LIGO won't be updated automatically even if new releases are issued;\n`+
      ` 2) If the CLI interface of LIGO is changed, the toolchain might not be able to compile your contracts anymore;\n` +
      ` 3) Your contract's code might not be compatible with newer versions of the LIGO compiler.\n` +
      `\nPlease consider using a specific LIGO compiler version, editing the "ligoVersion" property in config.json or proceed at your own risk.\n` +
      `Most recent supported version is: ${DEFAULT_LIGO_VERSION}\n`);
    return version;
  }

  if (isLigoVersionGT(version, DEFAULT_LIGO_VERSION)) {
    warn(`The specified LIGO compiler version "${version}" is above the most recent supported version ${DEFAULT_LIGO_VERSION}.\n` +
      `This might lead to unexpected behaviour or break the "compile" command, so proceed at your own risk.\n` +
      `\nPlease check if there's a new Lava release at https://www.npmjs.com/package/create-tezos-smart-contract and consider updating.\n`);
  }

  return (new SemVer(version)).toString();
};