
# Certhis Wallet

Certhis Wallet is a javascript package that makes it easy to integrate a wallet connection system by providing various login options, including email and using wallets like Metamask, Wallet Connect, and Coinbase Wallet.

## Installation

To install Certhis Wallet, open your terminal and run the following command:

Copy code

`npm install certhis-wallet` 

## Initialization

To use Certhis Wallet, you must first initialize it by importing the necessary libraries and calling the `init` function of `certhis-wallet` by passing in the `Web3`, `CoinbaseWalletSDK`, and `WalletConnectProvider` libraries as parameters.

`const Web3 = require("web3");
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
const certhis_wallet = require("certhis-wallet").init(
  Web3,
  CoinbaseWalletSDK,
  WalletConnectProvider
);` 

## Usage

To display the login window or to retrieve the provider if the user is logged in, you must call the `run` function of `certhis-wallet` by passing in the network ID, RPC URL, login window ID, custom class prefix, and an option to specify if the provider is expected or not.

`await certhis_wallet.run(network_id,rpc_ur,popup_id,class_custom_prefix, return_provider, disable_certhis_wallet);` 

Certhis Wallet allows user to connect to their wallet through email, which generates a new wallet for the user if the email is not already linked to one. A code is sent to the user's email and they can use it to log in and interact with their wallet through the application.

Additionally, there is a function that can be used to display the wallet information and export the private key of the wallet in a pop-up window for email-based connections:


`certhis_wallet.walletInfos();` 

There is also a function that detects if the user has any funds and prompts them to add funds to their wallet through a transfer or credit card (this service is coming soon)

`await certhis_wallet.addFundPopup(
            functionGasFees,
            address,
            value,
            chain_id
        );` 

Also, there is an endpoint provided by Certhis Wallet:

`https://wallet-api.certhis.io/wallet?email=email@exemple.com` 

This endpoint allows for generating or retrieving a wallet linked to an email.

In summary, Certhis Wallet is a javascript package that provides an easy-to-use interface for connecting to various types of wallets and includes a unique email-based login feature, as well as functions for displaying wallet information and adding funds.