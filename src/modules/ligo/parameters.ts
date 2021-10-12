import { LIGOVersions } from "./types";

export const isLigoVersionLT = (compare: LIGOVersions, to: LIGOVersions): boolean => {
  if (compare === LIGOVersions.next) {
    return false;
  } else if (compare === to) {
    return false;
  } else {
    const comp_version = compare.split(".");
    const to_version = compare.split(".");
    for (let i = 0; i < to_version.length; i++) {
      const sToken = comp_version[i];
      const tToken = to_version[i];
      if (parseInt(sToken) < parseInt(tToken)) {
        return true;
      }
    }

    return false;
  }
};

export const toLigoVersion = (version: string): LIGOVersions => {
  const availVersions = Object.values(LIGOVersions);

  for (const aVersion of availVersions) {
    if (aVersion === version) {
      return aVersion;
    }
  }

  throw new Error("Invalid LIGO compiler version (ligoVersion). Maybe it's too old? Valid values are " + availVersions.join(", "));
};