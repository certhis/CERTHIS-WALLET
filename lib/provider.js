module.exports = function (Web3, request) {
  return {
    async getProvider(wallet_address, wallet_private_key) {
      const popupLib = require("./popup")();
      console.log(popupLib);
      const web3 = new Web3();
      web3.eth.accounts.wallet.add(wallet_private_key);
      var rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
      var provider = new web3.providers.HttpProvider(rpcUrl);

      provider.on = function (type, callback) {
        console.log(type);
      };

      provider.send = async function (args, callback) {
        var { method, id, arg, params } = args;
        console.log(method);
        if (method == "eth_accounts") {
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: [wallet_address],
          });
        } else if (method == "eth_getBalance") {
          var balance = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_getBalance",
              params: [wallet_address, "latest"],
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: String(Number(balance.result)),
          });
        } else if (method == "net_version") {
          var chainId = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "net_version",
              params: [],
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: String(Number(chainId.result)),
          });
        } else if (method == "personal_sign") {
          var validPopup = await popupLib.showSignPopup(
            web3.utils.toUtf8(params[0])
          );

          if (validPopup == true) {
            const signature = await web3.eth.sign(
              web3.utils.toUtf8(params[0]),
              params[1]
            );
            callback(null, {
              jsonrpc: "2.0",
              id: id,
              result: String(signature),
            });
          } else {
            callback(new Error("user cancel signature"));
          }
        } else {
          callback(new Error("Method not implemented"));
        }
      };

      provider.sendAsync = provider.send;

      web3.setProvider(provider);

      return web3.currentProvider;
    },
  };
};
