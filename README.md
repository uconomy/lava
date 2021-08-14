# Get your Tezos Smart Contracts production-ready

So you want to write a smart-contract for the [Tezos blockchain](https://www.tezos.com)? You're in the right place!

## Requirements
This toolset it's entirely based on [Docker](https://www.docker.com) and [Node.js](https://nodejs.org/).

You can download Docker Desktop for your operative system at https://www.docker.com/products/docker-desktop. When download is ready, you can proceed to install it.

Same goes for Node.js, for which we suggest you download the LTS version for your system at https://nodejs.org/.

## Getting started
To use this toolset, just open a Terminal and type:

```sh
npx create-tezos-smart-contract
```

This will guide you trough the basic setup of the environment to start coding your contracts right away.

## Usage
[Created repository's README](./contract-bundle/REAME.md) will guide you over the entire toolset.

## Features
- Smart Contract(s) repository setup with just 1 command
- [**LIGO Compiler**](https://ligolang.org), dockerized, at the version you like (default version is *LIGO next*)
- **[Flextesa](https://gitlab.com/tezos/flextesa) local environment**, dockerized, to run Tezos test networks (node) at any version up to **Granada**
- [**Jest**](https://jestjs.io), with a proper setup to write both unit and E2E tests with [Taquito](https://tezostaquito.io)
- [**Deploy UI**](https://github.com/uconomy/tezos-builder-suite), designed to make your life easier. Helps you build your initial storage and lets you deploy in sandbox, testnet or mainnet. Works with faucet accounts and the Beacon SDK, to let you choose yout preferred wallet for signing

## Why?
Because we wanted Tezos development to follow a full process to release great production-ready software: coding, compiling, unit testing, end-to-end testing (both local and on Tezos testnet) and full fledged deploy on mainnet with all the available wallets.

## Why a toolset?
Tezos ecosystem now offers a lot of different tools to code, compile, test and interact with Smart Contracts. The problem is that sometimes you need to install software directly on your machine, sometimes you're prompted to use Docker and sometimes you might end up just with a big mess of separate tools which is also difficult to maintain and update as the Tezos protocol releases come out.

With `create-tezos-smart-contract` we'll bring together the latest updates of every single tool for you, you just need to use our last version.

## Why not Truffle?
[Truffle](https://www.Trufflesuite.com) offers one of the easiest ways to develop Tezos Smart Contracts. However, there were several choices in Truffle that made us decide to develop our own toolchain:
- The usage of a custom Docker-image sandbox (not aligned with Tezos updates)
- The inability to control your development flow in detail (contracts compiled everytime no matter what you needed)
- The usage of a custom library to write tests, not standard
- The usage of a custom library to interact with Tezos contracts in tests, not documented, you'd end up writing less tests because no documentation could be found on how to code them
- Truffle was born with Ethereum in mind. Let's be honest: all the Truffle toolset with UI is great for Ethereum, but the lack of it for Tezos makes it seem more like a less-maintained extension of Truffle instead of the real deal
- And, last but not least, Truffle codebase is full of Ethereum content. This made us decide not to contribute on that codebase, but rather to start a new and clean one, always open source.

## Supported development Tezos protocols
- Granada
- Florencenet

Might work also with earliers version of the protocol, but we highly discourage working on such versions as you may end up with less features, higher costs and even bugs.

## Contributing
We'd definitely love to have your contributions to this package.

If you want to write some code, we'll be more than happy to review and discuss every PR. Please refer to our [Contributing guide](./CONTRIBUTING.md) to discover how to work on this repository and how to submit your PRs.

If you like this project, please consider donating to help it evolve along with Tezos ecosystem and protocol updates. As you can imagine, this requires a lot of time and effort, and any donation will support us. [Reach us in any support channel](#lets-get-in-touch) to find how to donate in your preferred way.

## Let's get in touch
You can request support, give feedback, suggest features and donate to this project by contacting us in any of the following channels:

- Telegram Uconomy support channel [https://t.me/uconomy](https://t.me/uconomy)
- Uconomy developers Discord [https://discord.gg/Cabq36FVRh](https://discord.gg/Cabq36FVRh)

If you need help with code we'd suggest going for the Discord channel as it's easier to exchange code there.

## Donate
Want to help us with our coffee expenses? Here's our donation address tz1QBdqczeKCC6TW23MVrNXW217D5JomKzuL
