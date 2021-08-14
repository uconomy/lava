export const makeREADME = (name: string) =>
`# ${name}

## Requirements
This repository's toolset for development it's entirely based on [Docker](https://www.docker.com) and [Node.js](https://nodejs.org/).

You can download Docker Desktop for your operative system at https://www.docker.com/products/docker-desktop. When download is ready, you can proceed to install it.

Same goes for Node.js, for which we suggest you download the LTS version for your system at https://nodejs.org/.

Suggested but not necessary, you can [install Yarn package manager](https://yarnpkg.com/getting-started/install) which will enable you to write shorter commands.

## Preparation
To start using this contract, make sure you have all the needed packages to run it. To do so, in your Terminal just type:
\`\`\`bash
npm i
\`\`\`
or with yarn
\`\`\`bash
yarn
\`\`\`

## Important!
In the repository, \`config.json\` contains all the needed configuration for the tools to work. To change network settings, faucet accounts, and tools options please have a look there and also at the well-documented default [configuration source file](../src/modules/config/defaults.ts).

## Coding
Just use your preferred editor to work on the content of the \`contracts\` folder. We use Visual Studio Code with a LIGO language extension, but you're free to code as you wish.

## Compiling
As easy as:
\`\`\`bash
npm run compile
\`\`\`
or with yarn
\`\`\`bash
yarn compile
\`\`\`

You have several options available for this command, as the ability to specify a single contract to compile or your preferred LIGO version. Launch \`npm run compile -- --help\` or the shorter \`yarn compile --help\` to see the full guide.

## Testing
Tests are run by [**Jest**](https://jestjs.io), with a proper setup to write both unit and E2E tests with [Taquito](https://tezostaquito.io).

You can find tests in the \`test\` folder.

### Unit testing

Unit testing is the first step for checking contracts' code correctness. As the name says, they're designed to che check small portions (units) of code.
As Smart Contracts are stateful, doing unit testing with it can the tricky.

For this reaon, we implemented another command
\`\`\`bash
npm run start-sandbox
\`\`\`
or, with Yarn
\`\`\`bash
yarn start-sandbox
\`\`\`
to easily start a local Sanboxed environment (local Tezos network) which processes blockchain packages much faster than real Tezos network. This makes you able to **deploy a separate contract** with a determined storage for every single unit test you might want to run.

Then you just need to run
\`\`\`bash
npm run test
\`\`\`
or, with Yarn
\`\`\`bash
yarn test
\`\`\`
and you'll see your tests being performed. If you want the local sanbox to be started and stopped automatically every test run, please set \`autoSandbox: true\` in your *config.json*.

### End-to-end (E2E) Testing
End-to-end testing is tought to be simulating user interaction with your smart contract. This is to ensure that the expected usage of your contract produces the expexted storage/operations in the Tezos blockchain.

This is done on a single contract instead of one for every single test. For this reason, you can let the toolset deploy a contract for you in the sandbox, or you can deploy it in a testnet with the \`deploy\` commnd and then tell the e2e testing command to use that one.

E2E testing is as simple as
\`\`\`bash
npm run e2e-test
\`\`\`
or, with Yarn
\`\`\`bash
yarn e2e-test
\`\`\`
As in every command, running them with the help option let you discover some arguments you can tweak the command with.
For example, to run tests using the deployed version of \`test.ligo\` in the \`testnet\`environment, you should type:
\`\`\`bash
npm run e2e-test -- -c test.ligo:KT1... --network=testnet
\`\`\`
or, with Yarn
\`\`\`bash
yarn e2e-test -c test.ligo:KT1... --network=testnet
\`\`\`

## Deploy
You have a super-easy deploy tool in this repository. To bring it up, just launch this command:
\`\`\`bash
npm run deploy
\`\`\`
or, with Yarn
\`\`\`bash
yarn deploy
\`\`\`
It will guide you through all the step needed to Deploy the smart contract.
Pass \`--network=testnet\` or \`--network=mainnet\` to deploy in the specific network.

Have some nice Tezos coding!
`;
