# Tezos smart-contract toolset

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

This will guide you trough the basic setup of the environment to start coding your contracts right away!

## Features
- [**LIGO Compiler**](https://ligolang.org), dockerized, at the version you like (default version is *LIGO next*)
- **[Flextesa](https://gitlab.com/tezos/flextesa) local environment**, dockerized, to run Tezos test networks (node) at any version up to **Granada**
- [**Jest**](https://jestjs.io), with proper JavaScript (TypeScript) tooling to write tests
- **Deploy scripts**, prepared to make your life easier. Deploy tools and also help you test your deployment to Tezos public test networks
- Smart contract repository setup

## Supported Tezos networks
- Flextesa (local)
- Florencenet
- Granada
- Mainnet (official Tezos network)