# Certhis Wallet

**Live Example :** [here](https://codesandbox.io/s/certhis-wallet-react-lhuddn?file=/src/App.js)

Certhis Wallet is a javascript package that makes it easy to integrate a wallet connection system by providing various login options, including email and using wallets like Metamask, Wallet Connect, and Coinbase Wallet in your DAPP and enables users to interact with their WEB3 wallets.

![enter image description here](https://i.ibb.co/MPzr5J3/Untitled-design-27.png)

## Installation

To install Certhis Wallet, open your terminal and run the following command:

```sh

$ npm i @certhis/certhis-wallet

```

## Initialization

To use Certhis Wallet, you must first initialize it by importing the necessary libraries and calling the `init` function of `certhis-wallet`

```js
const CerthisWallet = require("@certhis/certhis-wallet");
const certhis_wallet = CerthisWallet.init();
const Web3 = certhis_wallet.getWeb3();
```

## Usage

To display the login window or to retrieve the provider if the user is logged in, you must call the `run` function of `certhis-wallet` by passing in the network ID, RPC URL, login window ID, custom class prefix, and an option to specify if the provider is expected or not.

```js
await certhis_wallet.run({
  rpc_id: rpc_id,
  rpc: rpc_link,
  id_insert: "popupCerthis",
  custom_prefix: "popupCerthis",
  return_provider: type,
  disable_certhis_wallet: 1,
});
```

Certhis Wallet allows user to connect to their wallet through email, which generates a new wallet for the user if the email is not already linked to one. A code is sent to the user's email and they can use it to log in and interact with their wallet through the application.

## Wallet Infos

Additionally, there is a function that can be used to display the wallet information and export the private key of the wallet in a pop-up window for email-based connections:

```js
certhis_wallet.walletInfos();
```

## Popup Add Fund

There is also a function that detects if the user has any funds and prompts them to add funds to their wallet through a transfer or credit card

```js

await  certhis_wallet.addFundPopup(
functionGasFees,
address,
value,
chain_id,
transactionInformation = {
transactionInformation.title,
transactionInformation.description,
transactionInformation.image,
transactionInformation.nb_items,
transactionInformation.erc20_amount,
transactionInformation.smart_contract,
transactionInformation.erc20_contract,
transactionInformation.erc20_amount
},
force
);

```

## Signature

```js
var sign = await provider.request({
  method: "personal_sign",
  params: [web3.utils.utf8ToHex("HELLO WORLD!"), current_address],
});
```

## Wallet by email

Also, there is an endpoint provided by Certhis Wallet:

`https://wallet-api.certhis.io/wallet?email=email@exemple.com`

This endpoint allows for generating or retrieving a wallet linked to an email.

In summary, Certhis Wallet is a javascript package that provides an easy-to-use interface for connecting to various types of wallets and includes a unique email-based login feature, as well as functions for displaying wallet information and adding funds.
