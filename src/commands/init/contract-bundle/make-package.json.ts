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
    "start": "npx tezos-sdk -- --help",
    "compile": "npx tezos-sdk compile",
    "start-sandbox": "npx tezos-sdk start-sandbox",
    "e2e-test": "npx tezos-sdk e2e-test",
    "test": "npx tezos-sdk test",
    "deploy": "npx tezos-sdk deploy",
    "postinstall": "npx tezos-sdk postinstall",
  },
  keywords: [
    "tezos",
    "blockchain"
  ]
});