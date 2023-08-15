module.exports = function (certhisWallet, request, addFundPopup) {
  var storageC = require("./storageAdaptater");
  const { Web3 } = require("web3");
  const EthereumUtil = require("ethereumjs-util");

  return {
    async getProvider(rpc, wallet_address, ecrypted_key) {
      wallet_address = EthereumUtil.toChecksumAddress(wallet_address);
      //rpc_list
      function hexToUint8Array(hexString) {
        if (hexString.startsWith("0x")) {
          hexString = hexString.slice(2);
        }

        if (hexString.length % 2 !== 0) {
          throw new Error("error");
        }

        const result = new Uint8Array(hexString.length / 2);

        for (let i = 0; i < hexString.length; i += 2) {
          result[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }

        return result;
      }
      const rpcinfo = require("./rpc");
      const sigUtil = require("eth-sig-util");

      var rpc_array = rpcinfo.rpc_array;

      const web3 = new Web3();

      //await get private key crypted
      const cryptoPopup = require("./cryptoPopup")(certhisWallet);
      var decrypted_private_key = await cryptoPopup.getDecryptedPrivate_key();
      web3.eth.accounts.wallet.add(decrypted_private_key);

      const popupLib = require("./popup")(web3);
      if (
        storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != undefined &&
        storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != ""
      ) {
        var rpcUrl = storageC.localStorageAdaptater.getItem("RPC_CERTHIS");
      } else {
        var rpcUrl = rpc;
        storageC.localStorageAdaptater.setItem("RPC_CERTHIS", rpc);
      }

      var provider = new web3.providers.HttpProvider(rpcUrl);

      provider.on = function (type, callback) {};

      provider.send = async function (args, callback) {
        var { method, id, arg, params } = args;
        var rpcUrl = storageC.localStorageAdaptater.getItem("RPC_CERTHIS");

        if (method == "eth_accounts") {
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            error: null,
            result: [wallet_address],
          });
        } else if (method == "eth_call") {
          var get_eth_call = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_call",
              params: params,
              id: id,
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
              id: id,
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
              id: id,
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

          var temp_value = 0;
          if (send_params.value == undefined) {
            temp_value = 0;
          } else {
            temp_value = send_params.value;
          }

          var last_transaction_in_temp = storageC.localStorageAdaptater.getItem(
            "last_transaction_in_temp"
          );

          //check time less 10 seconds
          if (
            last_transaction_in_temp != null &&
            last_transaction_in_temp != "{}"
          ) {
            storageC.localStorageAdaptater.removeItem(
              "last_transaction_in_temp"
            );
            last_transaction_in_temp = JSON.parse(last_transaction_in_temp);
            if (last_transaction_in_temp.transactionInformation == undefined) {
              last_transaction_in_temp.transactionInformation = {};
            }

            if (
              last_transaction_in_temp.transactionInformation.smart_contract ==
              undefined
            ) {
              last_transaction_in_temp.transactionInformation.smart_contract =
                "";
            }

            if (last_transaction_in_temp.continue == 1) {
              var validPopup = true;
            } else if (
              last_transaction_in_temp.transactionInformation.smart_contract.toLowerCase() ==
                send_params.to.toLowerCase() &&
              (last_transaction_in_temp.value == send_params.value ||
                last_transaction_in_temp.value == BigInt(temp_value) ||
                send_params.value == undefined ||
                send_params.value == "0x0")
            ) {
              last_transaction_in_temp.transactionInformation.smart_contract =
                send_params.to;

              var validPopup = await addFundPopup(
                String(send_params.gas),
                send_params.from,
                String(temp_value),
                storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS"),
                last_transaction_in_temp.transactionInformation,
                1
              );
            } else {
              var validPopup = await popupLib.showTransactionPopup(send_params);
            }
          } else {
            var validPopup = await addFundPopup(
              send_params.gas,
              send_params.from,
              String(temp_value),
              storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS"),
              { to_address: send_params.to },
              1
            );
            storageC.localStorageAdaptater.removeItem(
              "last_transaction_in_temp"
            );
          }

          if (validPopup == true) {
            let web3Temp = new Web3(
              new Web3.providers.HttpProvider(
                storageC.localStorageAdaptater.getItem("RPC_CERTHIS")
              )
            );

            var decrypted_private_key =
              await cryptoPopup.getDecryptedPrivate_key();

            web3Temp.eth.accounts.wallet.add(decrypted_private_key);

            const signedTransaction =
              await web3Temp.eth.accounts.signTransaction(
                params[0],
                decrypted_private_key
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
              id: id,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_getTransactionReceipt.result,
          });
        } else if (method == "eth_getTransactionCount") {
          var get_eth_getTransactionCount = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_getTransactionCount",
              params: params,
              id: id,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_getTransactionCount.result,
          });
        } else if (method == "eth_blockNumber") {
          var get_eth_blockNumber = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_blockNumber",
              params: params,
              id: id,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_blockNumber.result,
          });
        } else if (method == "eth_getBlockByNumber") {
          var get_eth_getBlockByNumber = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_getBlockByNumber",
              params: params,
              id: id,
            },
            rpcUrl
          );

          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: get_eth_getBlockByNumber.result,
          });
        } else if (method == "eth_subscribe") {
          var get_eth_subscribe = await request.post(
            null,
            {
              jsonrpc: "2.0",
              method: "eth_subscribe",
              params: params,
              id: id,
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
              id: id,
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
              id: id,
            },
            rpcUrl
          );
          storageC.localStorageAdaptater.setItem(
            "RPC_ID_CERTHIS",
            Number(chainId.result)
          );
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: Number(chainId.result),
          });
        } else if (method == "personal_sign" || method == "eth_sign") {
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
              result: String(signature.signature),
            });
          } else {
            callback(new Error("user cancel signature"));
          }
        } else if (method == "eth_signTypedData") {
          var validPopup = await popupLib.showSignPopup("**Typed Data**");

          if (validPopup == true) {
            var decrypted_private_key =
              await cryptoPopup.getDecryptedPrivate_key();

            const signature = sigUtil.signTypedData(
              hexToUint8Array(decrypted_private_key),
              { data: JSON.parse(params[1]) }
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
          storageC.localStorageAdaptater.setItem("RPC_CERTHIS", rpcUrl);
          storageC.localStorageAdaptater.setItem(
            "RPC_ID_CERTHIS",
            Number(params[0].chainId)
          );
          callback(null, {
            jsonrpc: "2.0",
            id: id,
            result: params[0],
          });
        } else {
          callback(new Error("Method not implemented"));
        }
      };
      var id = 1;
      provider.request = async function (args) {
        var eth_account_trig = false;
        if (args.id == undefined) {
          eth_account_trig = true;
          args.id = id;
          id++;
        }
    

        return new Promise(async (resolve, reject) => {
          var get_return = await provider.send(
            args,
            function (return_value, rpc_response) {
              if (rpc_response == undefined) {
                reject(false);
              } else {
          
                if (eth_account_trig == false) {
           
                  resolve(rpc_response);
                } else {
                
                  resolve(rpc_response.result);
                }
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
