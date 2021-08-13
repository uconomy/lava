export const makePackageJSON = (name: string, packageVersion: string) => ({
  name,
  version: "0.0.1",
  description: `${name} Tezos smart contract repository.`,
  dependencies: {
    "create-tezos-smart-contract": packageVersion,
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