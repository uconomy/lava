import { LIGOVersions } from "./types";

export const isLigoVersionLT = (compare: LIGOVersions, to: LIGOVersions) => {
  if (compare === LIGOVersions.next) {
    return false;
  } else {
    for (const sToken of compare.split('.')) {
      for (const tToken of to.split('.')) {
        if (parseInt(sToken) < parseInt(tToken)) {
          return true;
        }
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