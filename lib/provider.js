module.exports = function (Web3, request) {
  return {
    async getProvider(rpc, wallet_address, wallet_private_key) {
      //rpc_list
      const rpcinfo = require("./rpc");
      var rpc_array = rpcinfo.rpc_array;

      const web3 = new Web3();
      web3.eth.accounts.wallet.add(wallet_private_key);
      const popupLib = require("./popup")(web3);
      if (
        localStorage.getItem("RPC_CERTHIS") != undefined &&
        localStorage.getItem("RPC_CERTHIS") != ""
      ) {
        var rpcUrl = localStorage.getItem("RPC_CERTHIS");
      } else {
        var rpcUrl = rpc;
        localStorage.setItem("RPC_CERTHIS", rpc);
      }

      var provider = new web3.providers.HttpProvider(rpcUrl);

      provider.on = function (type, callback) {};

      provider.send = async function (args, callback) {
        var { method, id, arg, params } = args;
        var rpcUrl = localStorage.getItem("RPC_CERTHIS");
        console.log(method);
        if (method == "eth_accounts") {
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: [wallet_address],
          });
        } else if (method == "eth_call") {
          var get_eth_call = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_call",
              params: params,
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_call.result,
          });
        } else if (method == "eth_gasPrice") {
          var get_eth_gasPrice = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_gasPrice",
              params: params,
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_gasPrice.result,
          });
        } else if (method == "eth_estimateGas") {
          var get_eth_estimateGas = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_estimateGas",
              params: params,
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_estimateGas.result,
          });
        } else if (method == "eth_sendTransaction") {
          const send_params = params[0];
          var validPopup = await popupLib.showTransactionPopup(send_params);

          if (validPopup == true) {
            let web3Temp = new Web3(
              new Web3.providers.HttpProvider(
                localStorage.getItem("RPC_CERTHIS")
              )
            );

            web3Temp.eth.accounts.wallet.add(
              localStorage.getItem("WALLET_CERTHIS_PRIVATE_KEY")
            );

            const signedTransaction =
              await web3Temp.eth.accounts.signTransaction(
                params[0],
                localStorage.getItem("WALLET_CERTHIS_PRIVATE_KEY")
              );

            callback(null, {
              jsonrpc: "2.0",
              id: id,
              result: signedTransaction.transactionHash,
            });
            var signTransaction = await web3Temp.eth.sendSignedTransaction(
              signedTransaction.rawTransaction
            );

            callback(null, {
              jsonrpc: "2.0",
              id: id,
              result: signedTransaction,
            });
          } else {
            callback(new Error("User reject the transaction"));
          }
        } else if (method == "eth_getTransactionReceipt") {
          var get_eth_getTransactionReceipt = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_getTransactionReceipt",
              params: params,
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_getTransactionReceipt.result,
          });
        } else if (method == "eth_subscribe") {
          var get_eth_subscribe = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_subscribe",
              params: params,
              id: 1,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_subscribe.result,
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
        } else if (method == "net_version" || method == "eth_chainId") {
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
            result: Number(chainId.result),
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
        } else if (
          method == "wallet_switchEthereumChain" ||
          method == "wallet_addEthereumChain"
        ) {
          rpcUrl = rpc_array[Number(params[0].chainId)];
          localStorage.setItem("RPC_CERTHIS", rpcUrl);
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: params[0],
          });
        } else {
          callback(new Error("Method not implemented"));
        }
      };

      provider.request = async function (args) {
        args.id = 1;

        return new Promise(async (resolve, reject) => {
          var get_return = await provider.send(
            args,
            function (return_value, rpc_response) {
              if(rpc_response.result == undefined)
              {
                 reject(false);
              }
              else
              {
                 resolve(rpc_response.result);
              }
             
            }
          );
        });
      };

      provider.sendAsync = provider.send;

      web3.setProvider(provider);

      return web3.currentProvider;
    },
  };
};
