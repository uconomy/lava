import { Bundle } from "../../../bundle"

export const makePackageJSON = (bundle: Bundle) => ({
  name: bundle.domainName,
  version: "0.0.1",
  description: `${bundle.name} Tezos smart contract repository.`,
  dependencies: {
    // "create-tezos-smart-contract": "^0.0.1",
    "@taquito/signer": "^9.1.1",
    "@taquito/taquito": "^9.1.1",
    "jest": "^27.0.6"
  },
  scripts: {
    "compile": "node ./scripts/toolchain/compile",
    "start-sandbox": "node ./scripts/toolchain/start-sandbox",
    "stop-sandbox": "docker kill my-sandbox",
    "test": "jest"
  },
  keywords: [
    "tezos",
    "blockchain"
  ]
});