var rpc_array = {};
var currency_array = {};
var name_network = {};
var rpc_type = {};
var rpc_faucet = {};
var ether_scan_array = {};

//init all array
module.exports.init = async () => {
  return new Promise(async (resolve, reject) => {
    var storageC = require("./storageAdaptater");
    var request = require("./request")("https://api.certhis.io");

    var rpc_object = {};
    var certhisUpdatedRPC =
      storageC.localStorageAdaptater.getItem("certhisUpdatedRPC");
    var certhisStoredRPC =
      storageC.localStorageAdaptater.getItem("certhisStoredRPC");
    var date_now = new Date();
    var date_now_timestamp = date_now.getTime();
    var date_now_timestamp_hour = date_now_timestamp - 3600000;

    if (certhisUpdatedRPC && certhisStoredRPC && certhisStoredRPC != "{}") {
      if (certhisUpdatedRPC > date_now_timestamp_hour) {
        rpc_object = JSON.parse(certhisStoredRPC);
      }
    } else {
      var chains = await request.get("chains");
      chains = chains.data;
      storageC.localStorageAdaptater.setItem(
        "certhisUpdatedRPC",
        date_now_timestamp
      );
      for (var i = 0; i < chains.length; i++) {
        rpc_object[chains[i].chain_id] = chains[i];
      }
    }

    storageC.localStorageAdaptater.setItem(
      "certhisStoredRPC",
      JSON.stringify(rpc_object)
    );

    const chains_list = rpc_object;
    for (const chain of Object.values(chains_list)) {
      rpc_array[chain.chain_id] = chain.rpc;
      currency_array[chain.chain_id] = chain.symbol;
      name_network[chain.chain_id] = chain.name;
      ether_scan_array[chain.chain_id] = chain.scan_link;
      if (chain.mainnet == 1) {
        rpc_type[chain.chain_id] = "mainnet";
      } else {
        rpc_type[chain.chain_id] = "testnet";
      }
      rpc_faucet[chain.chain_id] = chain.faucet;
    }

    resolve({
      rpc_array,
      currency_array,
      name_network,
      ether_scan_array,
      rpc_type,
      rpc_faucet,
    });
  });
};

module.exports.rpc_array = async () => {
  return rpc_array;
};

module.exports.currency_array = async () => {
  return currency_array;
};

module.exports.name_network = async () => {
  return name_network;
};

module.exports.rpc_type = async () => {
  return rpc_type;
};

module.exports.rpc_faucet = async () => {
  return rpc_faucet;
};

module.exports.ether_scan_array = async () => {
  return ether_scan_array;
};
