# AuroraProbe (Built for Base)

## Overview

AuroraProbe is a minimal repository designed to validate Base compatibility by:
- Connecting a wallet using the Coinbase Wallet SDK
- Reading onchain data from Base networks using Viem
- Emitting Basescan links for deployment and verification workflows

This repo is explicitly tied to Base through:
- Base chain identifiers (Base Mainnet chainId 8453, Base Sepolia chainId 84532)
- Basescan explorer references and required deployment/verification link formats
- Base-focused account abstraction reference materials

## Networks

Base Mainnet
- chainId (decimal): 8453
- Explorer: https://basescan.org
- Public RPC (rate-limited): https://mainnet.base.org

Base Sepolia (testnet)
- chainId (decimal): 84532
- Explorer: https://sepolia.basescan.org
- Public RPC (rate-limited): https://sepolia.base.org

## What the Script Does

File: app/auroraProbe.ts

Core flow:
1) Initializes Coinbase Wallet SDK and creates an EIP-1193 provider pinned to a selected Base network
2) Requests a wallet connection and retrieves the active address
3) Performs Base onchain reads via an RPC-backed Viem public client:
   - chainId
   - latest block number
   - native ETH balance for the connected address
4) Prints Basescan links for:
   - connected address
   - an optional deployed contract address
5) Optionally reads ERC-20 metadata and the connected address token balance:
   - name, symbol, decimals, balanceOf

## Project Structure

- app/
  - auroraProbe.ts
    Main script. Wallet connect (Coinbase Wallet SDK) + Base RPC reads (Viem) + optional ERC-20 reads + Basescan links.

Typical supporting files (recommended for a browser run target):
- index.html
  Minimal UI providing elements used by the script:
  - network (select)
  - contract (input)
  - token (input)
  - run (button)
  - status (div/span)
  - out (pre/div)
- package.json
  Dependency and script definitions (Vite + TypeScript recommended).
- tsconfig.json
  TypeScript configuration.

## Libraries Used

- Coinbase Wallet SDK
  Provides a wallet provider integration used for connection flows.
  Source: https://github.com/coinbase/coinbase-wallet-sdk

- Viem
  Used to create wallet/public clients for EVM interactions and onchain reads.

## Installation

Requirements:
- Node.js 18+ recommended
- Browser environment (wallet connection requires a browser context)

Install dependencies in the repository root using your preferred package manager.

## Configuration

Optional environment variables:
- VITE_BASE_RPC_URL
  Overrides Base Mainnet RPC (default: https://mainnet.base.org)
- VITE_BASE_SEPOLIA_RPC_URL
  Overrides Base Sepolia RPC (default: https://sepolia.base.org)

Runtime inputs:
- Network selection: Base Mainnet (8453) or Base Sepolia (84532)
- Contract address (optional): prints Basescan deployment and verification links
- Token address (optional): reads ERC-20 metadata and balance for the connected address

## Running

Run as a small browser application:
- Start a dev server (Vite recommended).
- Open the app in a browser with a compatible wallet available.
- Select Base Sepolia for testing (chainId 84532) or Base Mainnet for production reads (chainId 8453).
- Optionally enter a deployed contract address and/or an ERC-20 token address.
- Click Run.

Expected output includes:
- Connected address and Basescan link
- RPC chainId confirmation
- Latest block number
- Native ETH balance
- Optional contract Basescan and verification links
- Optional ERC-20 token details and user balance

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

GitHub: https://github.com/pavlovanika
Public contact (email): ribbing.maxima.0z@icloud.com
Public contact (X): https://x.com/pavlovanikka_3

## References

Base Account SDK reference (createBaseAccount):
https://docs.base.org/base-account/reference/core/createBaseAccount?utm_source=chatgpt.com

Account Abstraction on Base:
https://docs.base.org/base-chain/tools/account-abstraction?utm_source=chatgpt.com

OnchainKit (SDK option reference):
https://github.com/coinbase/onchainkit

## Testnet Deployment (Base Sepolia)

A smart contract has been deployed to the Base Sepolia test network for validation and testing purposes.

Network: Base Sepolia
chainId (decimal): 84532
Explorer: https://sepolia.basescan.org
Deployed contract address: 0xeb5a2d3cce9010b85092916a328bbce3a26cee14

Basescan deployment and verification links:

Contract address: https://sepolia.basescan.org/address/0xeb5a2d3cce9010b85092916a328bbce3a26cee14
Contract verification (source code): https://sepolia.basescan.org/0xeb5a2d3cce9010b85092916a328bbce3a26cee14/0#code
This deployment is used to validate Base-compatible tooling, account abstraction flows, and onchain read operations in a test environment prior to mainnet usage.
