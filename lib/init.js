"use strict";

/**
 * @module certhis-wallet
 */

module.exports = function (api_key = null) {
  const { Web3 } = require("web3");
  var storageC = require("./storageAdaptater");
  var translate = require("./translate");
  var axios = require("axios");
  //check when window load

  try {
    var CoinbaseWalletSDK = require("@coinbase/wallet-sdk").CoinbaseWalletSDK;
    var show_coinbase_connect = "";
  } catch (e) {
    console.log(e);
    CoinbaseWalletSDK = false;
    show_coinbase_connect = "display:none;";
  }

  var activate_wallet_connect = true;
  try {
    var EthereumProvider =
      require("@walletconnect/ethereum-provider").EthereumProvider;

    var show_wallet_connect = "";
  } catch (e) {
    console.log(e);
    activate_wallet_connect = false;
    show_wallet_connect = "display:none;";
    CoinbaseWalletSDK = false;
    show_coinbase_connect = "display:none;";
  }

  const providerLib = require("./provider");
  const InjectCoinbase = CoinbaseWalletSDK;

  const axiosCurrency = require("axios").default;
  const apiCurrency = axiosCurrency.create({
    baseURL: "https://api.coinconvert.net/convert/",
    timeout: 3000,
  });
  var getContentType = function (url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("HEAD", url);
    xhttp.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        if (this.status == 404) {
          callback(false);
        } else {
          callback(this.getResponseHeader("Content-Type"));
        }
      }
    };
    xhttp.send();
  };
  var image = [
    "image/gif",
    "image/png",
    "image/jpeg",
    "image/bmp",
    "image/webp",
  ];
  var video = ["video/webm", "video/ogg", "video/mp4", "video/quicktime"];
  var audio = [
    "audio/midi",
    "audio/mpeg",
    "audio/webm",
    "audio/ogg",
    "audio/wav",
  ];
  var mime3d = ["model/gltf-binary"];
  var pdf = ["application/pdf"];

  const request = require("./request")(
    "https://wallet-api.certhis.io/",
    api_key
  );
  const certhisWallet = require("./certhisWallet")(request);

  const CryptoJS = require("crypto-js");
  // const rpcinfo =  await require("./rpc").init();
  // console.log("rpcinfo", rpcinfo);
  // var rpc_array = rpcinfo.rpc_array;

  storageC.localStorageAdaptater.setItem("last_transaction_in_temp", "{}");

  const load_nft_media = (id) => {
    // add spin loader

    const div = document.getElementById(id);
    const url = div.dataset.url;
    const style = div.dataset.style;

    if (!url) {
      div.innerHTML = "";
    } else {
      getContentType(url, (content_type) => {
        if (!content_type) {
          div.innerHTML = `<img src="${broken_file}" width="100%">`;
        } else {
          if (image.includes(content_type.toLowerCase())) {
            div.innerHTML = `<img src="${url}" style="${style}">`;
          }
          //video
          else if (video.includes(content_type.toLowerCase())) {
            div.innerHTML = `
            <video style="${style}" autoplay loop muted>
              <source src="${url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            `;
          }
          //audio
          else if (audio.includes(content_type.toLowerCase())) {
            div.innerHTML = `
            <audio controls>
              <source src="${url}" type="${content_type.toLowerCase()}">
              Your browser does not support the video tag.
            </audio>
            `;
          }
          //pdf
          else if (pdf.includes(content_type.toLowerCase())) {
            div.innerHTML = `<iframe src="${url}" style="${style}"></iframe>`;
          } else if (mime3d.includes(content_type.toLowerCase())) {
            div.innerHTML = `
            <model-viewer src="${url}" auto-rotate camera-controls style="${style}" quick-look-browsers="safari chrome"></model-viewer>
            `;
          } else {
            div.innerHTML = "";
          }
        }
      });
    }
  };

  var addFundPopup = async function (
    functionGasFees,
    address,
    value = 0,
    chain_id,
    transactionInformation = {},
    force = null
  ) {
    var mobile = false;
    var width = window.innerWidth;
    if (width < 810) {
      mobile = true;
    }

    var boxPopupAddFund = document.getElementById("boxPopupAddFundCerthis");
    const rpcinfo = await require("./rpc").init();
    if (boxPopupAddFund) {
      boxPopupAddFund.remove();
    }

    //new_web

    return new Promise(async (resolve, reject) => {
      if (functionGasFees == null || functionGasFees == 0) {
        functionGasFees = 300000;
      }

      let web3Temp = new Web3(
        new Web3.providers.HttpProvider(rpcinfo.rpc_array[chain_id])
      );
      var balance = await web3Temp.eth.getBalance(address);

      if (balance == undefined || balance == null) {
        balance = 0;
      }
      balance = web3Temp.utils.fromWei(String(balance), "ether");
      var currentGasPrice = await web3Temp.eth.getGasPrice();

      if (chain_id == 5) {
        currentGasPrice = Number(currentGasPrice) * 10 ** 7;
        currentGasPrice = BigInt(currentGasPrice);
      }

      console.log("currentGasPrice", currentGasPrice);
      console.log("functionGasFees", functionGasFees);

      var gas_price = web3Temp.utils.toWei(
        String(BigInt(functionGasFees)),
        "wei"
      );
      var gasPriceInWei = web3Temp.utils.toWei(
        String(BigInt(currentGasPrice)),
        "wei"
      );
      var totalFeeInWei = gas_price * gasPriceInWei;

      var gas_price = web3Temp.utils.fromWei(String(totalFeeInWei), "ether");

      var value_temp = value;
      if (value != 0) {
        value = web3Temp.utils.fromWei(String(value), "ether");
      }
      var amount_missing = Number(value) + Number(gas_price);
      var total_c = amount_missing;
      var total = Number(value);
      var total_fee = Number(gas_price);
      var balance_erc20 = 1;
      var erc20_amount = 0;
      if (transactionInformation.erc20_amount != undefined) {
        erc20_amount = transactionInformation.erc20_amount;
      }
      if (transactionInformation.erc20 == true) {
        const abitoken = require("./abi_token");
        var contracterc20 = transactionInformation.smart_contract;
        if (transactionInformation.erc20_contract != undefined) {
          contracterc20 = transactionInformation.erc20_contract;
        }
        var contract_mint_token = new web3Temp.eth.Contract(
          abitoken.token_abi,
          contracterc20
        );
        var balance_erc20 = await contract_mint_token.methods
          .balanceOf(address)
          .call();

        transactionInformation.erc20_name = await contract_mint_token.methods
          .name()
          .call();

        transactionInformation.erc20_symbol = await contract_mint_token.methods
          .symbol()
          .call();

        transactionInformation.erc20_decimals =
          await contract_mint_token.methods.decimals().call();

        if (
          transactionInformation.description == undefined &&
          contracterc20 == transactionInformation.smart_contract
        ) {
          var erc20_amount_human2 =
            BigInt(transactionInformation.erc20_amount) /
            10 ** transactionInformation.erc20_decimals;
          transactionInformation.description =
            "Approve to spend " +
            erc20_amount_human2 +
            " " +
            transactionInformation.erc20_symbol;
        }
      }

      if (
        balance >= amount_missing &&
        force == null &&
        balance_erc20 >= erc20_amount
      ) {
        //transactionInformation convert bigint to string
        for (var i in transactionInformation) {
          if (typeof transactionInformation[i] == "bigint") {
            transactionInformation[i] = String(transactionInformation[i]);
          }
        }

        storageC.localStorageAdaptater.setItem(
          "last_transaction_in_temp",
          JSON.stringify({
            timer: new Date().getTime(),
            functionGasFees: String(functionGasFees),
            address: address,
            value: String(value_temp),
            chain_id: String(chain_id),
            transactionInformation: transactionInformation,
          })
        );
        resolve(true);
      } else {
        if (balance >= amount_missing) {
          amount_missing = 0;
        } else {
          amount_missing = Number(amount_missing) - Number(balance);
        }

        var boxPopupAddFund = document.getElementById("addFundboxPopupCerthis");

        if (boxPopupAddFund) {
          boxPopupAddFund.remove();
        }

        amount_missing = format_number(amount_missing);
        total_c = format_number(total_c);
        total = format_number(total);
        total_fee = format_number(total_fee);

        balance = format_number(Number(balance));

        var boxPopupAddFund = document.createElement("div");

        boxPopupAddFund.id = "addFundboxPopupCerthis";
        boxPopupAddFund.style.position = "fixed";
        boxPopupAddFund.style.width = "100%";
        boxPopupAddFund.style["z-index"] = "78";
        boxPopupAddFund.style.height = "100%";
        boxPopupAddFund.style.top = 0;
        boxPopupAddFund.style.color = "#505050";
        boxPopupAddFund.style.background = "rgb(0 0 0 / 9%)";
        boxPopupAddFund.style["backdrop-filter"] = "blur(5px)";
        boxPopupAddFund.style["text-align"] = "center";
        boxPopupAddFund.style.display = "grid";

        if (mobile) {
          var withPopup = "100%";
          var display_block = "block";
          var with_block = "100%";
          var with_block2 = "100%";
          var hide_mobile = "display:none;";
          var padding_set = "10px";
          var mrg_left_logo = "10px";
        } else {
          var withPopup = "800px";
          var display_block = "flex";
          var with_block = "40%";
          var with_block2 = "50%";
          var hide_mobile = "";
          var padding_set = "30px";
          var mrg_left_logo = "20px";
        }
        var InsertHTMLBOX =
          '<div id="popup-add-fund-content-certhis" style="padding: 15px;font-family: Arial !important;position: relative;min-height: 300px;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;width: ' +
          withPopup +
          ';max-width: 98%;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;box-shadow: 0px 4px 15px -1px rgba(130, 130, 130, 0.25), 0px 4px 15px -1px rgba(130, 130, 130, 0.25);border-radius: 24px;">' +
          '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="max-height: 35px;width:auto;margin-left: ' +
          mrg_left_logo +
          ';margin-top: 20px;">' +
          '<div id="addfundclosePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
          '<div style="display: ' +
          display_block +
          ";justify-content: space-around;margin-top: 30px;margin-bottom: 30px;padding-left: " +
          padding_set +
          ";padding-right: " +
          padding_set +
          ';">';

        if (mobile == true) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="width:100%;" id="partinfonftmobilecw"><div style="display:inline-block;width:70%;text-align: left;">';
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="margin-bottom: 10px;font-weight: bold;">Transaction Information</div>';
        } else {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="text-align: left;width: ' +
            with_block +
            ';"><div style="margin-bottom: 10px;font-weight: bold;">Transaction Information</div>';
        }

        if (transactionInformation.title != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="font-size: 15px;color: #616161;">' +
            transactionInformation.title +
            '</div><div style="height: 1px;background: #B8B8B8;width: 70%;margin-top: 3px;margin-bottom: 12px;margin-left: 1px;"></div>';
        }

        if (transactionInformation.description != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="font-size: 12px;color: #616161;">' +
            transactionInformation.description +
            "</div>";
        }

        if (transactionInformation.image != undefined && mobile == false) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="width:100%;text-align:center;    margin-top: 20px;margin-bottom: 25px;"><div  id="nft_media_cw" data-style="box-shadow: 0px 4px 15px -1px rgba(130, 130, 130, 0.25);border-radius: 10px;height: 180px;margin: auto;    height: 180px;max-width: 100%;object-fit: cover;" data-url="' +
            transactionInformation.image +
            '"></div></div>';
        }

        if (mobile == true && transactionInformation.image != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '</div><div style="    vertical-align: top;width:30%;text-align:right;display: inline-block;"><div  id="nft_media_cw"  data-style="box-shadow: 0px 4px 15px -1px rgba(130, 130, 130, 0.25);border-radius: 10px;width: 100%;margin: auto;" data-url="' +
            transactionInformation.image +
            '"></div></div><div style="margin-top: 20px;"></div>';
        } else if (mobile == true) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '</div><div style="    vertical-align: top;width:30%;text-align:right;display: inline-block;"></div><div style="margin-top: 20px;"></div>';
        }
        var to_type = false;
        var full_address_type = false;
        if (transactionInformation.smart_contract != undefined) {
          to_type = "Smart Contract";
          full_address_type = transactionInformation.smart_contract;
        } else if (transactionInformation.to_address != undefined) {
          to_type = "Recipient";
          full_address_type = transactionInformation.to_address;
        }

        if (to_type != false) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="     margin-bottom: 10px; margin-top: 10px;   display: flex;justify-content: space-between;color: #616161;font-weight: 300;font-size: 14px;"><div>' +
            to_type +
            '</div> <div style="font-weight: bold;"><a href="' +
            rpcinfo.ether_scan_array[chain_id] +
            "address/" +
            full_address_type +
            '" target="_blank" style="color: #579ED5A8;text-decoration: underline;">' +
            full_address_type.replace(/(.{3}).*(.{3})/, "$1...$2") +
            "</a></div></div>";
        }

        if (transactionInformation.nb_items != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="    margin-bottom: 10px; margin-top: 10px; display: flex;justify-content: space-between;color: #616161;font-weight: 300;font-size: 14px;"><div>Number Items</div> <div style="font-weight: bold;">' +
            transactionInformation.nb_items +
            "</div></div>";
        }

        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="     margin-bottom: 10px; margin-top: 10px; display: flex;' +
          hide_mobile +
          'justify-content: space-between;color: #616161;font-weight: 300;font-size: 14px;"><div>Total</div> <div style="font-weight: bold;">' +
          +String(total) +
          " " +
          rpcinfo.currency_array[chain_id] +
          " <div id='total_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>";

        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="     margin-bottom: 10px; margin-top: 10px; display: flex;' +
          hide_mobile +
          'justify-content: space-between;color: #616161;font-weight: 300;font-size: 14px;"><div>Gas Fee</div> <div style="font-weight: bold;">' +
          +String(total_fee) +
          " " +
          rpcinfo.currency_array[chain_id] +
          " <div id='total_fee_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>";

        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="height: 1px;background: #B8B8B8;width: 100%;' +
          hide_mobile +
          'margin-top: 3px;margin-bottom: 12px;margin-left: 1px;"></div><div style="     margin-bottom: 10px; margin-top: 10px; display: flex;justify-content: space-between;color: #616161;font-weight: bold;font-size: 14px;" ><div>Total + Gas Fee</div> <div>' +
          +String(total_c) +
          " " +
          rpcinfo.currency_array[chain_id] +
          " <div id='total_c_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>";

        if (transactionInformation.erc20_amount > 0) {
          var erc20_amount_human =
            BigInt(transactionInformation.erc20_amount) /
            BigInt(10) ** transactionInformation.erc20_decimals;

          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="     margin-bottom: 10px; margin-top: 10px; display: flex;justify-content: space-between;color: #616161;font-weight: bold;font-size: 14px;" ><div>Total ERC20</div> <div>' +
            +String(erc20_amount_human) +
            " " +
            transactionInformation.erc20_symbol +
            "</div></div>";
        }
        InsertHTMLBOX =
          InsertHTMLBOX +
          "</div>" +
          '<div style="    width: 1px;background: #61616133;margin-left: 5%; margin-right: 5%;' +
          hide_mobile +
          '"></div><div id="first_step_add_fund_certhis" style="   width: ' +
          with_block2 +
          ';">' +
          '<div style="    display: flex;' +
          hide_mobile +
          'justify-content: space-between;    font-size: 14px;    margin-bottom: 10px; margin-top: 10px;" ><div>Your Balance</div> <div style="    font-weight: bold;">' +
          String(balance) +
          " " +
          rpcinfo.currency_array[chain_id] +
          " <div id='balance_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>" +
          '<div style="  position: relative; display: flex;justify-content: space-between;    font-size: 14px; margin-bottom: 10px; margin-top: 10px;"  ><div >Your Wallet</div> <div style="    font-weight: bold;"><div id="copiedstickcw2" style="    position: absolute;background: #000000a6;display:none;color: #fff;font-size: 12px;right: 0;top: -27px;padding: 3px;padding-left: 10px;border-radius: 10px;padding-right: 10px;" >Copied</div><a href="' +
          rpcinfo.ether_scan_array[chain_id] +
          "address/" +
          address +
          '" target="_blank" style="color: #579ED5A8;text-decoration: underline;">' +
          address.replace(/(.{3}).*(.{3})/, "$1...$2") +
          "</a>" +
          '<img src="https://utility-apps-assets.certhis.io/certhisWallet/copy.png" id="copy2cw" style="height: 22px;cursor: pointer;margin-left: 10px;"></div></div>';

        if (amount_missing > 0) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="    display: flex;justify-content: space-between;    font-size: 14px; margin-bottom: 10px; margin-top: 10px;"  ><div>Amount Missing</div> <div style="    font-weight: bold;">' +
            String(amount_missing) +
            " " +
            rpcinfo.currency_array[chain_id] +
            "<div id='amount_missing_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>";
        }

        if (
          transactionInformation.erc20 == true &&
          transactionInformation.erc20_name != undefined
        ) {
          if (balance_erc20 == 0) {
            var balance_erc20_human = 0;
          } else {
            var balance_erc20_human =
              BigInt(balance_erc20) /
              BigInt(10) ** transactionInformation.erc20_decimals;
          }

          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="    display: flex;justify-content: space-between;    font-size: 14px; margin-bottom: 10px; margin-top: 10px;"  ><div>Your ' +
            transactionInformation.erc20_name +
            ' balance</div> <div style="    font-weight: bold;">' +
            String(balance_erc20_human) +
            " " +
            transactionInformation.erc20_symbol +
            "</div></div>";

          if (balance_erc20 < erc20_amount) {
            var amount_missing_erc20 = erc20_amount - balance_erc20;
            amount_missing_erc20 =
              BigInt(amount_missing_erc20) /
              10 ** transactionInformation.erc20_decimals;
            InsertHTMLBOX =
              InsertHTMLBOX +
              '<div style="    display: flex;justify-content: space-between;    font-size: 14px; margin-bottom: 10px; margin-top: 10px;"  ><div>Amount Missing ' +
              transactionInformation.erc20_name +
              '</div> <div style="    font-weight: bold;">' +
              String(amount_missing_erc20) +
              " " +
              transactionInformation.erc20_symbol +
              "<div id='amount_missing_usd' style='font-size: 12px;display: inline-block;font-weight: 300;color: #616161;margin-left: 5px;'></div></div></div>";
          }
        }

        InsertHTMLBOX = InsertHTMLBOX + '<div id="part_button_payment" >';
        var refresh_balance = false;
        var active_showBoxTransacCerthisWallet = false;
        if (amount_missing > 0 || balance_erc20 < erc20_amount) {
          refresh_balance = true;
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="    color: #b8b8b8;font-size: 14px;text-align: center;margin-bottom: 30px; margin-top: 30px;">You need additional credits in your wallet to pay the transaction.</div> ' +
            `<div id="paytweed" style="display:none;width:100%;">
            <button style="display: block; margin: auto;width: 100%;border: none;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;font-family: system-ui;" id="showpaytweed">Pay via Credit Card</button>
            </div>`;
          if (transactionInformation.erc20 != true) {
            if (rpcinfo.rpc_type[chain_id] == "mainnet") {
              active_showBoxTransacCerthisWallet = true;
              InsertHTMLBOX =
                InsertHTMLBOX +
                '<img style="width: 116px;max-width: 100%;" src="https://utility-apps-assets.certhis.io/certhisWallet/pay.png"><button style="display: block; margin: auto;width: 100%;border: none;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;font-family: system-ui;" id="showBoxTransacCerthisWallet">Add Fund via Credit Card</button>';
            } else {
              InsertHTMLBOX =
                InsertHTMLBOX +
                '<div style="font-size: 14px;margin-top: 20px;display:none;" id="pendingcwf">Pending <img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/load.svg" style="    width: 20px;margin-left: 5px;"/></div><a style="text-decoration: none;cursor: pointer;color:#000" target="_blank" href="' +
                rpcinfo.rpc_faucet[chain_id] +
                '"> <button style=" display: block; margin: auto;width: 100%;border: none;   background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;font-family: system-ui;" id="addfundfaucetcw">Add funds via Faucet (FREE)</button></a>';
            }
          }

          InsertHTMLBOX =
            InsertHTMLBOX +
            '<button  id="transferFundButton" style="  display: block; margin: auto;width: 100%;border: none;  background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;font-family: system-ui;">Transfer Funds</button>';
        } else {
          InsertHTMLBOX =
            InsertHTMLBOX +
            ' <button style=" display: block; margin: auto;width: 100%;border: none;   background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;" id="confirmcw">Confirm</button></a>';
        }

        InsertHTMLBOX =
          InsertHTMLBOX +
          ' </div> <div id="transferFundPart" style="display:none;">' +
          '<div id="previoustransferFund" style="cursor: pointer;text-align: center;font-size: 13px;margin-top: 30px;padding-right: 10px;width: 100%;text-transform: capitalize;color: #505050;display: block;">&#8592 previous</div><div style="font-size: 16px; margin-top: 10px;margin-bottom: 20px;font-weight: bold;">Transfer Funds to your wallet</div>' +
          '<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' +
          address +
          '">' +
          '<div style="position:relative;display: flex;" ><img src="https://utility-apps-assets.certhis.io/certhisWallet/copy.png" id="copyaddpcwallet" style="cursor:pointer;width: 20px;position: absolute;right: 11px;top: 26px;"><div id="copiedstickcw" style="    position: absolute;background: #000000a6;display:none;color: #fff;font-size: 12px;right: 0;top: -7px;padding: 3px;padding-left: 10px;border-radius: 10px;padding-right: 10px;" >Copied</div><input value="' +
          address +
          '" id="valueaddresscw" type="text" style="background: #F8F8F8;border: 1px solid #D1D1D1;border-radius: 8px;color: #616161;font-weight: 300;font-size: 12px;display: block;width: 100%;padding: 8px;padding-left: 20px;padding-right: 50px;margin-top: 20px;" readonly></div>' +
          '<div style="font-size: 14px;margin-top: 20px;">Pending <img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/load.svg" style="    width: 20px;margin-left: 5px;"/></div></div>';
        var current_currency = rpcinfo.currency_array[chain_id].toLowerCase();

        if (current_currency == "matic") {
          current_currency = "maticpolygon";
        } else if (current_currency == "avax") {
          current_currency = "avaxc";
        } else if (current_currency == "bnb") {
          current_currency = "bnbbsc";
        }

        //display_tweed

        InsertHTMLBOX =
          InsertHTMLBOX +
          "</div>" +
          `<div id="block_tweed" style="  display: none;"><div id="previousPaytweed" style="cursor: pointer;text-align: left;font-size: 13px;padding-right: 10px;width: 100%;text-transform: capitalize;color: #505050;display: block;">&#8592 previous</div><iframe id="iframepaytweed" frameborder="no" allowtransparency="true" allowfullscreen="" style="  height: 438px;width: 100%;margin: auto;margin-bottom: 10px;border:none;"></iframe>
</div>` +
          '<div id="paymentFrame" style="display:none;width: ' +
          with_block2 +
          ';"><div id="previousCrediCardcw" style="cursor: pointer;text-align: left;font-size: 13px;padding-right: 10px;width: 100%;text-transform: capitalize;color: #505050;display: block;">&#8592 previous</div><iframe height="384px" id="iframeChallengly" src="https://widget.changelly.com?from=usd&to=' +
          current_currency +
          "&amount=150&address=" +
          address +
          "&fromDefault=usd&toDefault=" +
          current_currency +
          '&merchant_id=at4WvVb-71cB1hIk&payment_id=&v=3&type=no-rev-share&color=000&headerId=1&logo=hide&buyButtonTextId=6" frameborder="no" allowtransparency="true" allowfullscreen="" style="    display: block;width: 100%;margin: auto;margin-bottom: 10px;border:none;">' +
          "</iframe>" +
          '</div><div id="successFramecw" style="display:none;width: ' +
          with_block2 +
          ';"><img src="https://utility-apps-assets.certhis.io/certhisWallet/success3.gif" style="width:100px"><div style="font-weight: bold;margin-top: 20px;">Transaction Success</div> <button style="display: block; margin: auto;width: 100%;border: none;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;" id="continueButtoncw">Confirm</button></div></div>' +
          "</div>";

        boxPopupAddFund.innerHTML = InsertHTMLBOX;

        document.body.appendChild(boxPopupAddFund);

        if (transactionInformation.paytweed != undefined) {
          (async () => {
            try {
              //show paytweed
              document.getElementById("paytweed").style.display = "block";

              var get_link_iframe = await axios.post(
                "https://paytweed.certhis.io/get-payment-link",
                transactionInformation.paytweed
              );
              //iframepaytweed src = get_link_iframe.data.widget_url;
              document.getElementById("iframepaytweed").src =
                get_link_iframe.data.widgetUrl;
            } catch (e) {
              console.log(e);
              //hide paytweed
              document.getElementById("paytweed").style.display = "none";
            }
          })();
        }

        if (transactionInformation != undefined) {
          if (transactionInformation.image != undefined) {
            load_nft_media("nft_media_cw");
          }
        }
        var convert = apiCurrency
          .get(rpcinfo.currency_array[chain_id].toLowerCase() + "/usd", {
            params: { amount: 1 },
          })
          .then((response) => {
            if (amount_missing > 0) {
              var amount_missing_usd = amount_missing * response.data["USD"];

              document.getElementById("amount_missing_usd").innerHTML =
                " ($" + amount_missing_usd.toFixed(2) + ")";
            }

            var balance_usd = balance * response.data["USD"];
            document.getElementById("balance_usd").innerHTML =
              " ($" + balance_usd.toFixed(2) + ")";

            var total_usd = total * response.data["USD"];
            document.getElementById("total_usd").innerHTML =
              " ($" + total_usd.toFixed(2) + ")";

            var total_c_usd = total_c * response.data["USD"];
            document.getElementById("total_c_usd").innerHTML =
              " ($" + total_c_usd.toFixed(2) + ")";

            var total_fee_usd = total_fee * response.data["USD"];
            document.getElementById("total_fee_usd").innerHTML =
              " ($" + total_fee_usd.toFixed(2) + ")";

            var amount_missing_usd = amount_missing_usd * 1.1;

            if (amount_missing_usd < 35) {
              amount_missing_usd = 35;
            }

            document.getElementById("iframeChallengly").src =
              "https://widget.changelly.com?from=usd&to=" +
              current_currency +
              "&amount=" +
              parseInt(amount_missing_usd) +
              "&address=" +
              address +
              "&fromDefault=usd&toDefault=" +
              current_currency +
              "&merchant_id=at4WvVb-71cB1hIk&payment_id=&v=3&type=no-rev-share&color=000&headerId=1&logo=hide&buyButtonTextId=6";
          })
          .catch((err) => {
            console.log(err.response.data);
          });

        let first_step_add_fund_certhis = document.querySelector(
          "#first_step_add_fund_certhis"
        );
        var first_step_add_fund_certhisN =
          first_step_add_fund_certhis.cloneNode(true);
        first_step_add_fund_certhis.parentNode.replaceChild(
          first_step_add_fund_certhisN,
          first_step_add_fund_certhis
        );

        //detect when on iframe change to https://paytweed.certhis.io/success-payment

        window.addEventListener("message", function (event) {
          try {
            if (event.origin === "https://paytweed.certhis.io") {
              //detect if receive params
              if (event.data.params.txhash) {
                //save txhash to localstorage
                storageC.localStorageAdaptater.setItem(
                  "paytweedHash",
                  event.data.params.txhash
                );
                boxPopupAddFund.style.display = "none";

                //detect IS_WALLET_CERTHIS
                if (
                  sessionStorage.getItem("IS_WALLET_CERTHIS") == "true" ||
                  sessionStorage.getItem("IS_WALLET_CERTHIS") == true
                ) {
                  return resolve(true);
                } else {
                  return resolve(event.data.params.txhash);
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        });

        let paymentFrame = document.querySelector("#paymentFrame");
        var paymentFrameN = paymentFrame.cloneNode(true);
        paymentFrame.parentNode.replaceChild(paymentFrameN, paymentFrame);

        let closePopup = document.querySelector("#addfundclosePopupLib");
        var closePopupN = closePopup.cloneNode(true);
        closePopup.parentNode.replaceChild(closePopupN, closePopup);

        closePopupN.addEventListener("click", function () {
          boxPopupAddFund.style.display = "none";
          clearInterval(start_interval);
          resolve(false);
        });

        if (
          rpcinfo.rpc_type[chain_id] == "mainnet" &&
          transactionInformation.erc20 != true &&
          active_showBoxTransacCerthisWallet == true
        ) {
          let showBoxTransacCerthisWallet = document.querySelector(
            "#showBoxTransacCerthisWallet"
          );
          var showBoxTransacCerthisWalletN =
            showBoxTransacCerthisWallet.cloneNode(true);
          showBoxTransacCerthisWallet.parentNode.replaceChild(
            showBoxTransacCerthisWalletN,
            showBoxTransacCerthisWallet
          );

          showBoxTransacCerthisWalletN.addEventListener("click", function () {
            if (mobile) {
              document.querySelector("#partinfonftmobilecw").style.display =
                "none";
            }
            first_step_add_fund_certhisN.style.display = "none";
            paymentFrameN.style.display = "block";
          });
        }

        if (amount_missing > 0 || balance_erc20 < erc20_amount) {
          let transferFundButton = document.querySelector(
            "#transferFundButton"
          );
          var transferFundButtonN = transferFundButton.cloneNode(true);
          transferFundButton.parentNode.replaceChild(
            transferFundButtonN,
            transferFundButton
          );

          transferFundButtonN.addEventListener("click", function () {
            if (mobile) {
              document.querySelector("#partinfonftmobilecw").style.display =
                "none";
            }

            document.querySelector("#transferFundPart").style.display = "block";
            document.querySelector("#part_button_payment").style.display =
              "none";
          });
        }

        //showpaytweed

        let showpaytweed = document.querySelector("#showpaytweed");
        var showpaytweedN = showpaytweed.cloneNode(true);
        showpaytweed.parentNode.replaceChild(showpaytweedN, showpaytweed);

        showpaytweedN.addEventListener("click", function () {
          //first_step_add_fund_certhis hide
          if (mobile) {
            document.querySelector("#partinfonftmobilecw").style.display =
              "none";
          }
          document.querySelector("#first_step_add_fund_certhis").style.display =
            "none";
          document.querySelector("#block_tweed").style.display = "block";
        });

        //previousPaytweed
        let previousPaytweed = document.querySelector("#previousPaytweed");
        var previousPaytweedN = previousPaytweed.cloneNode(true);
        previousPaytweed.parentNode.replaceChild(
          previousPaytweedN,
          previousPaytweed
        );

        previousPaytweedN.addEventListener("click", function () {
          if (mobile) {
            document.querySelector("#partinfonftmobilecw").style.display =
              "block";
          }

          document.querySelector("#block_tweed").style.display = "none";
          document.querySelector("#first_step_add_fund_certhis").style.display =
            "block";
        });

        let copyaddpcwallet = document.querySelector("#copyaddpcwallet");
        var copyaddpcwalletN = copyaddpcwallet.cloneNode(true);
        copyaddpcwallet.parentNode.replaceChild(
          copyaddpcwalletN,
          copyaddpcwallet
        );

        copyaddpcwalletN.addEventListener("click", function () {
          var valueaddresscw = document.querySelector("#valueaddresscw");
          var copiedstickcw = document.querySelector("#copiedstickcw");

          valueaddresscw.select();
          document.execCommand("copy");
          valueaddresscw.remove();
          copiedstickcw.style.display = "block";

          //delay hide copiedstickcw
          setTimeout(function () {
            copiedstickcw.style.display = "none";
          }, 2000);
        });

        var previoustransferFund = document.querySelector(
          "#previoustransferFund"
        );
        var previoustransferFundN = previoustransferFund.cloneNode(true);
        previoustransferFund.parentNode.replaceChild(
          previoustransferFundN,
          previoustransferFund
        );
        previoustransferFundN.addEventListener("click", function () {
          if (mobile) {
            document.querySelector("#partinfonftmobilecw").style.display =
              "block";
          }
          document.querySelector("#transferFundPart").style.display = "none";
          document.querySelector("#part_button_payment").style.display =
            "block";
        });

        var previousCrediCardcw = document.querySelector(
          "#previousCrediCardcw"
        );
        var previousCrediCardcwN = previousCrediCardcw.cloneNode(true);
        previousCrediCardcw.parentNode.replaceChild(
          previousCrediCardcwN,
          previousCrediCardcw
        );
        previousCrediCardcwN.addEventListener("click", function () {
          if (mobile) {
            document.querySelector("#partinfonftmobilecw").style.display =
              "block";
          }

          paymentFrameN.style.display = "none";
          document.querySelector("#first_step_add_fund_certhis").style.display =
            "block";
        });

        var copy2cw = document.querySelector("#copy2cw");
        var copy2cwN = copy2cw.cloneNode(true);
        copy2cw.parentNode.replaceChild(copy2cwN, copy2cw);
        copy2cwN.addEventListener("click", function () {
          var fakearea = document.createElement("textarea");
          fakearea.value = address;
          document.body.appendChild(fakearea);
          var copiedstickcw2 = document.querySelector("#copiedstickcw2");

          fakearea.select();
          document.execCommand("copy");
          fakearea.remove();

          copiedstickcw2.style.display = "block";

          //delay hide copiedstickcw
          setTimeout(function () {
            copiedstickcw2.style.display = "none";
          }, 2000);
        });

        var start_interval;
        if (refresh_balance == true) {
          start_interval = setInterval(async function () {
            var balanceN = await web3Temp.eth.getBalance(address);
            balanceN = web3Temp.utils.fromWei(String(balanceN), "ether");
            var balance_erc20N = 0;

            if (transactionInformation.erc20 == true) {
              balance_erc20N = await contract_mint_token.methods
                .balanceOf(address)
                .call();
            }

            var amount_missingN = Number(value) + Number(gas_price);
            if (
              Number(balanceN) >= amount_missingN &&
              (balance_erc20N >= erc20_amount ||
                transactionInformation.erc20 != true)
            ) {
              first_step_add_fund_certhisN.style.display = "none";
              paymentFrameN.style.display = "none";
              document.querySelector("#successFramecw").style.display = "block";
              clearInterval(start_interval);
            }
          }, 5000);
        }

        var continueButtoncw = document.querySelector("#continueButtoncw");
        var continueButtoncwN = continueButtoncw.cloneNode(true);
        continueButtoncw.parentNode.replaceChild(
          continueButtoncwN,
          continueButtoncw
        );
        continueButtoncwN.addEventListener("click", function () {
          storageC.localStorageAdaptater.setItem(
            "last_transaction_in_temp",
            JSON.stringify({
              timer: new Date().getTime(),
              continue: 1,
              functionGasFees: String(functionGasFees),
              address: address,
              value: value,
              chain_id: chain_id,
              transactionInformation: transactionInformation,
            })
          );
          boxPopupAddFund.style.display = "none";
          resolve(true);
        });

        if (amount_missing > 0 && rpcinfo.rpc_type[chain_id] != "mainnet") {
          var addfundfaucetcw = document.querySelector("#addfundfaucetcw");
          var addfundfaucetcwN = addfundfaucetcw.cloneNode(true);
          addfundfaucetcw.parentNode.replaceChild(
            addfundfaucetcwN,
            addfundfaucetcw
          );
          addfundfaucetcwN.addEventListener("click", function () {
            document.querySelector("#pendingcwf").style.display = "block";
          });
        }

        if (amount_missing <= 0 && balance_erc20 >= erc20_amount) {
          var confirmcw = document.querySelector("#confirmcw");
          var confirmcwN = confirmcw.cloneNode(true);
          confirmcw.parentNode.replaceChild(confirmcwN, confirmcw);
          confirmcwN.addEventListener("click", function () {
            boxPopupAddFund.style.display = "none";
            resolve(true);
          });
        }
      }
    });
  };

  const providerFunction = providerLib(certhisWallet, request, addFundPopup);

  var format_number = function (amount) {
    const factor = Math.pow(10, 5);
    const roundedAmount = Math.round(amount * factor) / factor;
    var return_price = roundedAmount.toFixed(5);

    if (Number.isInteger(Number(amount))) {
      amount = parseInt(return_price);
    } else {
      amount = return_price;
    }
    return amount;
  };
  return {
    getWeb3: function () {
      return Web3;
    },
    walletInfos: async function () {
      const rpcinfo = await require("./rpc").init();
      let web3Temp = new Web3(
        new Web3.providers.HttpProvider(
          rpcinfo.rpc_array[
            storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
          ]
        )
      );
      var balance = await web3Temp.eth.getBalance(
        storageC.localStorageAdaptater.getItem("WALLET_CERTHIS")
      );
      balance = web3Temp.utils.fromWei(String(balance), "ether");

      var boxWallet = document.getElementById("boxWalletCerthis");

      if (boxWallet) {
        boxWallet.remove();
      }
      boxWallet = document.createElement("div");
      boxWallet.id = "boxWalletCerthis";
      boxWallet.style.position = "fixed";
      boxWallet.style.width = "100%";
      boxWallet.style["z-index"] = "78";
      boxWallet.style.height = "100%";
      boxWallet.style.top = 0;

      boxWallet.style.background = "rgb(0 0 0 / 9%)";
      boxWallet.style["backdrop-filter"] = "blur(5px)";
      boxWallet.style["text-align"] = "center";
      boxWallet.style.display = "grid";

      var InsertHTMLBOX =
        '<div id="certhis-wallet-popup-content-certhis" style="font-family: Arial !important;position: relative;min-height: 300px;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;min-width: 300px;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 5px;">' +
        '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="     max-height: 35px;margin-left: 20px;margin-top: 30px;">' +
        '<div id="certhis-security-closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
        '<div style="margin-top: 15px;margin-bottom: 10px;margin-top: 20px;"></div>' +
        '<div id="step1-wallet-certhis-show" style="text-align:center;padding:10px;">' +
        '<div style="text-align: center;font-size: 23px;    margin-bottom: 10px;">Your Wallet Address</div>' +
        '<div style="color:#7A7A7A;font-size:13px;">' +
        storageC.localStorageAdaptater.getItem("WALLET_CERTHIS") +
        "</div>" +
        '<div style="margin-top: 50px;margin-bottom: 30px; font-size: 20px;"><div style="   display: inline-block;width: 50%;text-align: left;font-size: 14px;">Network</div><div style="display: inline-block;width: 50%;text-align: right;font-size: 14px;">' +
        rpcinfo.name_network[
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
        ] +
        "</div></div>" +
        '<div style="    font-size: 20px;"><div style="display: inline-block;width: 50%;text-align:left;font-size: 14px;">Balance</div><div style="display: inline-block;width: 50%;text-align: right;font-size: 14px;">' +
        balance +
        " " +
        rpcinfo.currency_array[
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
        ] +
        "</div></div>" +
        '<div id="exportbutton-certhis-wallet" style="cursor: pointer;margin-top: 70px;text-decoration: underline;font-weight: bold;font-size: 14px;">Export my Private Key</div>' +
        "</div>" +
        '<div id="step-agree-certhis-wallet" style="display:none;padding:10px;">' +
        '<div style="text-align: center;font-size: 23px;    margin-bottom: 10px;">Export my Private Key</div>' +
        '<div style="color:#7A7A7A;font-size:13px;">By exporting  the private key for :<br>' +
        storageC.localStorageAdaptater.getItem("WALLET_CERTHIS") +
        "<br>You agreeing that : </div>" +
        '<div style="max-width: 300px;margin: auto;color:#7A7A7A;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-1"> As a user of Certhis\' services, you acknowledge that you have read and agreed to the terms outlined in the company\'s <a href="https://certhis.io/terms-of-use">Terms of Use</a> & <a href="https://certhis.io/privacy-policy">Privacy Policy</a>, including the risks associated with owning your own private key.</div>' +
        '<div style="max-width: 300px;margin: auto;color:#7A7A7A;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-2"> It is your responsibility to properly manage and secure this key, as well as any assets associated with it. Certhis cannot assist you in recovering, accessing, or storing your raw private key.</div>' +
        '<div style="max-width: 300px;margin: auto;color:#7A7A7A;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-3"> Certhis cannot provide customer support for any third-party wallet software you may use in conjunction with your private key, and does not guarantee compatibility or protection for these products.</div>' +
        '<button disabled="true" id="confirmExportCerthisWallet"  style="opacity:0.3;font-family: arial;width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border: none;    border-radius: 50px;    color: #fff;    padding: 6px;    padding-left: 25px;    padding-right: 25px;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;    margin: auto;margin-bottom: 20px;">Export</button>' +
        "</div>" +
        '<div id="step-code-certhis-wallet"  style="display:none;">' +
        '<div style="  padding-left: 20px;text-align: left;font-size: 23px;    margin-bottom: 10px;">Security Verification</div>' +
        '<div style="    padding-left: 20px;margin-bottom: 10px;font-size: 15px;color: #7A7A7A;text-align: left;">You have received a code via email.<br>Please enter the code to continue.</div>' +
        '<div id="CerthisSecurityErrorMessageCerthisWalletAuthCode" style="display:none;color:red;"></div>' +
        '<div style="padding:25px;">' +
        '<input type="text"  id="certhis-wallet-certhis-code-1" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;"  maxlength="1">' +
        '<input type="text"  id="certhis-wallet-certhis-code-2" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;"  maxlength="1">' +
        '<input type="text"  id="certhis-wallet-certhis-code-3" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;"  maxlength="1">' +
        '<input type="text"  id="certhis-wallet-certhis-code-4" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;"  maxlength="1">' +
        '<input type="text"  id="certhis-wallet-certhis-code-5" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;"  maxlength="1">' +
        "</div>" +
        '<div style="margin: auto;font-size: 13px;margin-bottom: 20px;margin-top: 30px;color: #807979;line-height: 21px;max-width: 295px;">Didn\'t received the code? <span id="certhiswalletSecurityResend" style="    text-decoration: underline;cursor: pointer;width: fit-content;display: inline-block;        ">Resend</span></div>' +
        '<button id="certhiswalletConfirm"  style="font-family: arial;width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border: none;    border-radius: 50px;    color: #fff;    padding: 6px;    padding-left: 25px;    padding-right: 25px;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;    margin: auto;margin-bottom: 20px;">Confirm</button>' +
        "</div>" +
        '<div id="step-private-certhis-wallet"  style=" padding: 25px;display:none;">' +
        '<div style=" text-align: center;font-size: 23px;    margin-bottom: 10px;">Reveal Private Key</div>' +
        '<div style="margin-bottom: 40px;margin-top: 40px;font-size: 15px;color: red;text-align: center;">Attention! Make sure to keep it safe and secure.<br>Do not share it with anyone.</div>' +
        '<textarea readonly id="private-key-export-certhis" style=" font-family:arial;   background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: navajowhite;width: 100%;height: 100px;margin-bottom: 35px;color: #000000;margin-top: 0px;font-size: 17px;padding: 10px;letter-spacing: 1px;"></textarea>';
      "</div>" + "</div>";

      boxWallet.innerHTML = InsertHTMLBOX;

      document.body.appendChild(boxWallet);

      let step1 = document.querySelector("#step1-wallet-certhis-show");
      var step1N = step1.cloneNode(true);
      step1.parentNode.replaceChild(step1N, step1);

      let step2 = document.querySelector("#step-agree-certhis-wallet");
      var step2N = step2.cloneNode(true);
      step2.parentNode.replaceChild(step2N, step2);

      let step3 = document.querySelector("#step-code-certhis-wallet");
      var step3N = step3.cloneNode(true);
      step3.parentNode.replaceChild(step3N, step3);

      let step4 = document.querySelector("#step-private-certhis-wallet");
      var step4N = step4.cloneNode(true);
      step4.parentNode.replaceChild(step4N, step4);

      let checkbox1 = document.querySelector("#checkbox-certhis-wallet-1");
      var checkbox1N = checkbox1.cloneNode(true);
      checkbox1.parentNode.replaceChild(checkbox1N, checkbox1);

      let checkbox2 = document.querySelector("#checkbox-certhis-wallet-2");
      var checkbox2N = checkbox2.cloneNode(true);
      checkbox2.parentNode.replaceChild(checkbox2N, checkbox2);

      let checkbox3 = document.querySelector("#checkbox-certhis-wallet-3");
      var checkbox3N = checkbox3.cloneNode(true);
      checkbox3.parentNode.replaceChild(checkbox3N, checkbox3);

      let button = document.querySelector("#confirmExportCerthisWallet");
      var buttonN = button.cloneNode(true);
      button.parentNode.replaceChild(buttonN, button);

      let textarea = document.querySelector("#private-key-export-certhis");
      var textareaN = textarea.cloneNode(true);
      textarea.parentNode.replaceChild(textareaN, textarea);

      function checkCheckboxes() {
        if (checkbox1N.checked && checkbox2N.checked && checkbox3N.checked) {
          buttonN.disabled = false;
          buttonN.style.opacity = "1";
        } else {
          buttonN.disabled = true;
          buttonN.style.opacity = "0.3";
        }
      }

      checkbox1N.addEventListener("change", function () {
        checkCheckboxes();
      });
      checkbox2N.addEventListener("change", function () {
        checkCheckboxes();
      });
      checkbox3N.addEventListener("change", function () {
        checkCheckboxes();
      });

      buttonN.addEventListener("click", async function () {
        var send_auth = await certhisWallet.auth(
          storageC.localStorageAdaptater.getItem("WALLET_EMAIL")
        );

        step1N.style.display = "none";
        step2N.style.display = "none";
        step3N.style.display = "block";

        return false;
      });

      let exportWallet = document.querySelector("#exportbutton-certhis-wallet");
      var exportWalletN = exportWallet.cloneNode(true);
      exportWallet.parentNode.replaceChild(exportWalletN, exportWallet);

      exportWalletN.addEventListener("click", function () {
        step1N.style.display = "none";
        step2N.style.display = "block";

        return false;
      });

      let closePopup = document.querySelector(
        "#certhis-security-closePopupLib"
      );
      var closePopupN = closePopup.cloneNode(true);
      closePopup.parentNode.replaceChild(closePopupN, closePopup);

      closePopupN.addEventListener("click", function () {
        boxWallet.style.display = "none";
        return false;
      });

      var validCodeCerthisWallet = document.querySelector(
        "#certhiswalletConfirm"
      );

      var validCodeCerthisWalletN = validCodeCerthisWallet.cloneNode(true);

      validCodeCerthisWallet.parentNode.replaceChild(
        validCodeCerthisWalletN,
        validCodeCerthisWallet
      );
      var checkValidCode = validCodeCerthisWalletN.addEventListener(
        "click",
        function () {
          validCode();
        }
      );

      var certhiswalletSecurityResend = document.querySelector(
        "#certhiswalletSecurityResend"
      );

      var certhiswalletSecurityResendN =
        certhiswalletSecurityResend.cloneNode(true);

      certhiswalletSecurityResend.parentNode.replaceChild(
        certhiswalletSecurityResendN,
        certhiswalletSecurityResend
      );
      var blockResend = false;
      var checkcerthiswalletSecurityResend =
        certhiswalletSecurityResendN.addEventListener(
          "click",
          async function () {
            if (blockResend == false) {
              blockResend = true;

              let time = 0;

              var interval = setInterval(() => {
                var time_to_show = 220 - time;

                certhiswalletSecurityResendN.textContent = `Code Sent. ( Wait ${time_to_show} Secondes for a new code )`;

                time++;

                certhiswalletSecurityResendN.style["text-decoration"] = "none";
                if (time_to_show <= 1) {
                  certhiswalletSecurityResendN.textContent = `Resend`;
                  certhiswalletSecurityResendN.style["text-decoration"] =
                    "underline";
                }

                if (time >= 220) {
                  clearInterval(interval);
                }
              }, 1000);

              var send_auth = await certhisWallet.auth(
                storageC.localStorageAdaptater.getItem("WALLET_EMAIL")
              );

              setTimeout(() => {
                blockResend = false;
                certhiswalletSecurityResendN.style["text-decoration"] =
                  "underline";
                certhiswalletSecurityResendN.textContent = "Resend";
              }, 22000);
            }
          }
        );

      for (let i = 1; i <= 5; i++) {
        var input = document.querySelector(`#certhis-wallet-certhis-code-${i}`);

        var inputN = input.cloneNode(true);
        input.parentNode.replaceChild(inputN, input);
        inputN.addEventListener("input", function (event) {
          var value = event.target.value;
          if (value.length === 1) {
            var nextInput = document.querySelector(
              `#certhis-wallet-certhis-code-${
                Number(event.target.id.split("-")[4]) + 1
              }`
            );

            if (Number(event.target.id.split("-")[4]) == 5) {
              validCode();
            }
            nextInput.focus();
          }
        });

        inputN.addEventListener("keydown", function (event) {
          var previousInput = document.querySelector(
            `#certhis-wallet-certhis-code-${
              Number(event.target.id.split("-")[4]) - 1
            }`
          );

          if (event.key === "Backspace" && event.target.value.length === 0) {
            if (Number(event.target.id.split("-")[4]) >= 2) {
              previousInput.focus();
            }
          }
        });

        inputN.addEventListener("paste", function (event) {
          event.preventDefault();
          var paste = event.clipboardData.getData("text");
          if (paste.length >= 5) {
            for (let j = 1; j <= 5; j++) {
              document.querySelector(
                `#certhis-wallet-certhis-code-${j}`
              ).value = paste[j - 1];
            }
            validCode();
          }
        });
      }

      var validBlock = false;
      async function validCode() {
        var ErrorMessageCerthisWalletAuthCode = document.querySelector(
          "#CerthisSecurityErrorMessageCerthisWalletAuthCode"
        );

        let code = "";
        for (let i = 1; i <= 5; i++) {
          var input = document.querySelector(
            `#certhis-wallet-certhis-code-${i}`
          );
          code += input.value;
        }

        var isValid = /^[A-Za-z0-9]{5}$/.test(code);

        if (validBlock == false) {
          validBlock = true;
          if (isValid) {
            ErrorMessageCerthisWalletAuthCode.style.display = "None";

            var validCode = await certhisWallet.check(
              storageC.localStorageAdaptater.getItem("WALLET_CERTHIS"),
              code
            );

            validCode = validCode.data;
            if (validCode == undefined) {
              validCode = {};
            }
            if (validCode.encrypted_key != undefined) {
              storageC.localStorageAdaptater.setItem(
                "WALLET_ECRYPTED_KEY",
                validCode.encrypted_key
              );
              var private_key = await certhisWallet.check2(
                storageC.localStorageAdaptater.getItem("WALLET_CERTHIS"),
                storageC.localStorageAdaptater.getItem("WALLET_ECRYPTED_KEY")
              );
              var decrypted_private_key = CryptoJS.AES.decrypt(
                private_key.data.encrypted_private_key,
                storageC.localStorageAdaptater.getItem("WALLET_ECRYPTED_KEY")
              ).toString(CryptoJS.enc.Utf8);

              storageC.localStorageAdaptater.setItem(
                "WALLET_ECRYPTED_KEY",
                private_key.data.next_key
              );

              //store new encrypted key

              textareaN.value = decrypted_private_key;

              step3N.style.display = "none";
              step4N.style.display = "block";
            } else {
              ErrorMessageCerthisWalletAuthCode.textContent = "Invalid Code";
              ErrorMessageCerthisWalletAuthCode.style.display = "block";
              validBlock = false;
              //error code
            }
          } else {
            ErrorMessageCerthisWalletAuthCode.textContent =
              "Invalid Code Format";
            ErrorMessageCerthisWalletAuthCode.style.display = "block";
            validBlock = false;
            //error code
          }
        }
      }
    },
    addFundPopup: addFundPopup,
    disconnect: async function () {
      return new Promise(async (resolve, reject) => {
        storageC.localStorageAdaptater.removeItem("CONNECTED");
        storageC.localStorageAdaptater.removeItem("walletconnect");
        storageC.localStorageAdaptater.removeItem("WALLET_CERTHIS");
        storageC.localStorageAdaptater.removeItem("WALLET_ECRYPTED_KEY");
        storageC.localStorageAdaptater.removeItem("RPC_CERTHIS");
        storageC.localStorageAdaptater.removeItem("RPC_ID_CERTHIS");
        storageC.localStorageAdaptater.removeItem("WALLET_TYPE");
        storageC.localStorageAdaptater.removeItem("WALLET_EMAIL");
        storageC.localStorageAdaptater.removeItem("IS_WALLET_CERTHIS");
        //force sign delete
        storageC.localStorageAdaptater.removeItem("force_sign");
        resolve(null);
      });
    },
    storageC: storageC,
    rpc_adaptater: async function () {
      const rpcinfo = await require("./rpc").init();
      return rpcinfo;
    },
    SendOnhash: function ({hash, chain_id}) {
      let handlers = {};
      let errorHandlers;

      const process = async (args) => {
        try {
          setTimeout(() => {
            if (handlers["transactionHash"]) {
              handlers["transactionHash"](hash);
            }
          }, 1000);

          //get receipt from hash and emit receipt
          const rpcinfo = await require("./rpc").init();
          let web3Temp = new Web3(
            new Web3.providers.HttpProvider(
              rpcinfo.rpc_array[
                chain_id
              ]
            )
          );
          if (handlers["receipt"]) {
            let receipt = await web3Temp.eth.getTransactionReceipt(hash);
            if (receipt != null) {
              handlers["receipt"](receipt);
            }
          }
        } catch (e) {
          console.log(e);
          if (errorHandlers) {
            errorHandlers(e);
          }
        }
      };

      return {
        on: function (eventName, callback) {
          handlers[eventName] = callback;
          return this;
        },
        catch: function (callback) {
          errorHandlers = callback;
          return this;
        },
        send: function (args) {
          process(args);

          return {
            on: this.on,
            catch: this.catch,
          };
        },
      };
    },
    run: async function (args) {
      var rpc_id = args.rpc_id;
      var rpc = args.rpc;

      if (args.force_sign == true) {
        storageC.localStorageAdaptater.setItem("force_sign", true);
      }

      //get brand info from api
      if (
        api_key != null &&
        (storageC.localStorageAdaptater.getItem(
          "certhis_brand_info_" + api_key
        ) == null ||
          storageC.localStorageAdaptater.getItem(
            "certhis_brand_info_" + api_key
          ) == undefined ||
          storageC.localStorageAdaptater.getItem(
            "certhis_brand_info_" + api_key
          ) == "undefined" ||
          storageC.localStorageAdaptater.getItem(
            "certhis_brand_info_" + api_key
          ) == "" ||
          storageC.localStorageAdaptater.getItem(
            "certhis_brand_info_" + api_key
          ) == "null" ||
          storageC.localStorageAdaptater.getItem(
            "certhis_brand_info_" + api_key
          ) == "{}")
      ) {
        var brand_info = await request.get("brand");
        //save brand info
        storageC.localStorageAdaptater.setItem(
          "certhis_brand_info_" + api_key,
          JSON.stringify(brand_info.data)
        );
      }

      var wallet_style = "black";
      var powered_brand = "";
      if (args.wallet_style == "white") {
        wallet_style = args.wallet_style;
      }
      var close_img =
        "https://utility-apps-assets.certhis.io/certhisWallet/v2/certhis_close.png";
      var certhis_icon =
        "https://utility-apps-assets.certhis.io/certhisWallet/v2/certhis_icon.png";
      var invert_img = "";
      var d_none;
      var g_color = "#f4f4f4;";
      var r_border = "1px solid rgba(255, 255, 255, 0.50);";
      var r_color = "#ffffff;";
      var bg_box =
        "radial-gradient(44.42% 44.42% at 50% 50%, rgba(18, 18, 18, 0.76) 0%, #121212 100%);";
      var base_color = "#ffffff;";
      var border_input = "0;";
      var bg_button = "#ffffff;";
      var color_button = "#121212;";
      if (wallet_style == "white") {
        invert_img = "-webkit-filter: invert(1);filter: invert(1);";
        bg_box =
          "radial-gradient(44.42% 44.42% at 50% 50%, rgb(18 18 18 / 0%) 0%, #fff 100%);";
        base_color = "#121212;";
        border_input = "1.031px solid rgba(0, 0, 0, 0.10);";
        bg_button = "#121212;";
        color_button = "#fff;";
        r_border = "1px solid rgba(0, 0, 0, 0.50);";
        r_color = "#000000;";
        d_none = "display:none;";
        g_color = "#616161;";
        close_img =
          "https://utility-apps-assets.certhis.io/certhisWallet/c2ww.png";
        certhis_icon =
          "https://utility-apps-assets.certhis.io/certhisWallet/l2ww.png";
      }

      var branded_wallet = false;
      try {
        if (api_key != null) {
          var current_branding = JSON.parse(
            storageC.localStorageAdaptater.getItem(
              "certhis_brand_info_" + api_key
            )
          );

          if (
            current_branding.brand_logo != undefined &&
            current_branding.brand_name != undefined &&
            api_key != null
          ) {
            branded_wallet = true;
          }
        }
      } catch (e) {
        console.log(e);
      }

      var header_wallet = `<div style="    white-space: nowrap;"><div style="background: radial-gradient(1465.66% 602.63% at 21.26% 58%, #72F6FE 0%, #121212 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;    display: inline-block;">Connect</div> with Certhis</div>`;

      if (branded_wallet == true) {
        header_wallet = `<div style="white-space: nowrap;"><img src="${current_branding.brand_logo}" style="max-width: 104.034px;
        margin-top: -9px;"></div>`;
        powered_brand = `<div style="text-align: center;
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        color: #999;
        display: flex;
        justify-content: center;
        gap: 10px;
        align-items: center;    margin-bottom: 20px;">powered and secured by<img src="https://utility-apps-assets.certhis.io/certhisWallet/cgw.png" style="    width: 70px;"></div>`;
      }

      if (
        rpc_id == "undefined" ||
        rpc == "undefined" ||
        rpc_id == undefined ||
        rpc == undefined ||
        rpc_id == null ||
        rpc == null ||
        rpc_id == "" ||
        rpc == "" ||
        rpc_id == "null" ||
        rpc == "null" ||
        rpc_id == "Null" ||
        rpc == "Null" ||
        rpc_id == "NaN" ||
        rpc == "NaN" ||
        rpc_id == "Nan" ||
        rpc == "Nan" ||
        rpc_id == "nan" ||
        rpc == "nan"
      ) {
        storageC.localStorageAdaptater.setItem("RPC_ID_CERTHIS", 1);
        storageC.localStorageAdaptater.setItem("RPC_CERTHIS", rpc_array[1]);

        rpc = rpc_array[1];
        rpc_id = 1;
      }

      var id_insert = "popupCerthis";
      if (args.id_insert != undefined) {
        var id_insert = args.id_insert;
      }

      var custom_prefix = "";
      if (args.custom_prefix != undefined) {
        custom_prefix = args.custom_prefix;
      }

      var return_provider = null;
      if (args.return_provider != undefined) {
        return_provider = args.return_provider;
      }

      var disable_certhis_wallet = null;
      if (args.disable_certhis_wallet != undefined) {
        disable_certhis_wallet = args.disable_certhis_wallet;
      }

      var version_wallet_logo = 2;
      if (args.version_wallet_logo != undefined) {
        version_wallet_logo = args.version_wallet_logo;
      }

      var is_mobile = false;

      //detect with screen size < 972
      if (window.innerWidth <= 550) {
        is_mobile = true;
      }

      var lang = "en";
      //detect lang browser
      if (navigator.language != undefined) {
        lang = navigator.language;
        lang = lang.split("-")[0];
      }

      return new Promise(async (resolve, reject) => {
        var metamask_logo =
          "https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/2.png";
        var wallet_connect_logo =
          "https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/3.png";
        var coinbase_logo =
          "https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/1.png";

        if (version_wallet_logo == 2) {
          metamask_logo =
            "https://utility-apps-assets.certhis.io/certhisWallet/m2.png";
          wallet_connect_logo =
            "https://utility-apps-assets.certhis.io/certhisWallet/w2.png";
          coinbase_logo =
            "https://utility-apps-assets.certhis.io/certhisWallet/c2.png";
        }

        const style = document.createElement("style");
        var key_f = `@keyframes smooth-appear {
          to{
          
            opacity:1;
          }
        }`;
        if (is_mobile == true) {
          var key_f = `@keyframes smooth-appear {
            to{
            
              margin-bottom:0;
              opacity:1;
            }
          }`;
        }

        style.textContent = `${key_f}.CerthisWalletLoading{  padding-right: 41px !important;}  .CerthisWalletLoading::after {content: "";    position: absolute;    width: 16px;    height: 16px;    margin-top: 4px;    margin-left: 13px;    border: 2px solid transparent;    border-color: #000000 transparent #000000 transparent;    border-radius: 50%;    animation: CerthisWalletLoading-spinner 1s ease infinite;} @keyframes CerthisWalletLoading-spinner {  from {    transform: rotate(0turn);  }  to {    transform: rotate(1turn);  }} .certhisWalletStyle a {color:#616161 !important} .certhisWallet { font-family: arial !important;} .certhisWalletStyle button{font-family: Arial!important;;} .certhisWalletStyle button:hover{     box-shadow: 0px 0px 0px rgb(0 0 0 / 24%), 0px 1px 4px rgb(0 0 0 / 25%)!important; }  .certhisWalletStyle input::placeholder { font-family:Arial!important;; }  @media only screen and (max-width:500px) { #popup-content-certhis{ width: 100%!important; margin-bottom:-500px;
 
          right: 0;
          left: 0;
          position: fixed;
          bottom: 0; } }`;
        document.body.appendChild(style);

        //disable certhis wallet engine
        var display_none_certhis_wallet = "";
        var text_wallet_connect_with = "Or connect with";

        const pattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i"
        );

        if (
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != undefined &&
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != "" &&
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") !=
            "undefined" &&
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != undefined &&
          !pattern.test(storageC.localStorageAdaptater.getItem("RPC_CERTHIS"))
        ) {
          var rpcUrl = storageC.localStorageAdaptater.getItem("RPC_CERTHIS");
        } else {
          var rpcUrl = rpc;
          storageC.localStorageAdaptater.setItem("RPC_CERTHIS", rpc);
        }

        if (
          !pattern.test(rpcUrl) ||
          rpcUrl == "" ||
          rpcUrl == undefined ||
          rpcUrl == "undefined"
        ) {
          storageC.localStorageAdaptater.setItem("CONNECTED", "false");
        }
        if (
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") !=
            undefined &&
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") != "" &&
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") !=
            "undefined" &&
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") != "NaN" &&
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") != "null"
        ) {
          var rpcId = storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS");
        } else {
          var rpcId = rpc_id;
          storageC.localStorageAdaptater.setItem("RPC_ID_CERTHIS", rpc_id);
        }

        var boxCerthis = document.getElementById(id_insert);

        if (storageC.localStorageAdaptater.getItem("CONNECTED") == "true") {
          if (
            storageC.localStorageAdaptater.getItem("WALLET_TYPE") == "METAMASK"
          ) {
            const accounts = await window.ethereum.enable();
            storageC.localStorageAdaptater.setItem("IS_WALLET_CERTHIS", false);
            resolve(window.ethereum);
          } else if (
            storageC.localStorageAdaptater.getItem("WALLET_TYPE") == "COINBASE"
          ) {
            var LoadCoinbase = new InjectCoinbase({
              appName: "Certhis Wallet",
              appLogoUrl: "https://certhis.io/assets/images/logo.png",
              darkMode: false,
              overrideIsMetaMask: false,
            });

            var provider = LoadCoinbase.makeWeb3Provider(rpcUrl, rpcId);
            await provider.send("eth_requestAccounts");
            storageC.localStorageAdaptater.setItem("IS_WALLET_CERTHIS", false);

            resolve(provider);
          } else if (
            storageC.localStorageAdaptater.getItem("WALLET_TYPE") ==
              "WALLETCONNECT" &&
            activate_wallet_connect != false
          ) {
            const provider = await EthereumProvider.init({
              projectId: "2b30b85274289d9784546715b058dac8", // REQUIRED your projectId
              chains: [rpcId], // REQUIRED chain ids
              // optionalChains: [137, 1, 80001, 5, 97, 56, 43113, 43114],
              showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal
              // REQUIRED ethereum methods
              methods: ["eth_sendTransaction", "personal_sign"],
              optionalMethods: [
                "eth_sendTransaction",
                "personal_sign",
                "eth_sign",
                "eth_signTransaction",
                "eth_signTypedData",
                "wallet_switchEthereumChain",
                "wallet_addEthereumChain",
              ],
              optionalEvents: ["chainChanged", "accountsChanged"], // REQUIRED ethereum events,

              //get current url
              metadata: {
                name: "Certhis Wallet",
                url: window.location.href,
                description:
                  "Experience seamless Web3 navigation with Certhis Wallet.",
                icons: ["https://cdn.certhis.io/images/FAVICON.png"],
              },
            });
            await provider.enable();
            storageC.localStorageAdaptater.setItem("IS_WALLET_CERTHIS", false);

            resolve(provider);
          } else {
            var getProvider = await providerFunction.getProvider(
              rpcUrl,
              storageC.localStorageAdaptater.getItem("WALLET_CERTHIS"),
              storageC.localStorageAdaptater.getItem("WALLET_ECRYPTED_KEY")
            );
            storageC.localStorageAdaptater.setItem("IS_WALLET_CERTHIS", true);

            resolve(getProvider);
          }

          if (boxCerthis) {
            boxCerthis.style.display = "none";
          }
        } else if (
          ((!boxCerthis && id_insert == "popupCerthis") ||
            (boxCerthis && id_insert != "popupCerthis")) &&
          return_provider == null
        ) {
          if (id_insert == "popupCerthis") {
            boxCerthis = document.createElement("div");
            boxCerthis.style.position = "fixed";
            boxCerthis.style.width = "100%";
            boxCerthis.style["backdrop-filter"] = "blur(5px)";
            boxCerthis.style.height = "100%";
            boxCerthis.style.top = 0;
            boxCerthis.style.background = "rgb(0 0 0 / 9%)";
            boxCerthis.style["text-align"] = "center";
            boxCerthis.style.display = "grid";
            boxCerthis.style["z-index"] = "78";
            boxCerthis.style["font-family"] = "arial";
          }

          boxCerthis.classList.add("certhisWalletStyle");
          boxCerthis.id = id_insert;

          var InsertHTMLBOX = "";

          if (id_insert == "popupCerthis") {
            var add_style = "";
            if (is_mobile == true) {
              add_style = `bottom: 0;
              right: 0;
              left: 0;
              max-width: 100%;
              border-radius: 30px 30px 0px 0px;
              position: fixed;
              width: 414px;
              margin-bottom: -500px;  max-width: 100%;`;
            }

            InsertHTMLBOX = `<div id="${id_insert}
              -box-content-certhis" style="    width: 392px;
              position: relative;
              padding: 0px;
              min-height: 300px;
              display: grid;
              align-content: center;
              margin: auto;
              max-width: 99%;
              border-radius: 30px;
              animation: smooth-appear 1s ease forwards;
            opacity: 0;
              background: #FFF;
              box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);${add_style}">
              <div id="${id_insert}-closePopup" style="    position: absolute;
              width: fit-content;

              cursor: pointer;
         
    width: 25.779px;
    height: 25.779px;
              width: 25.779px;
              height: 25.779px;right: 22px;
              top: 27px;z-index:15;"><img src="${close_img}" style="width: 25px;
              height: 25px;"></div>`;
          }

          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div id="' +
            id_insert +
            '-step1CerthisWallet" class="' +
            custom_prefix +
            'certhisWalletbox" >' +
            '<div class="' +
            custom_prefix +
            `certhisWalletPart1" style="display: flex;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 28px;
            background: ${bg_box}` +
            display_none_certhis_wallet +
            '">' +
            `
            <img src="${certhis_icon}" style="width: 40px;
            position: absolute;
            left: 27px;
            top: 22px;" >
            <div style="width: 100%;
            display: flex;
            align-items: center;
            margin-top: 22px;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            line-height: normal;
            color: #fff;
            justify-content: center;
          
            margin-top: 33px;
    margin-bottom: 11px;
  
        ">${header_wallet}</div>` +
            `<div  style="    margin-bottom: 25px;
            color: ${base_color}
            margin-top: 18px;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            line-height: normal;
            width: 100%;" class="certhiswalletsecond_text">Log in <div style="font-size: 15px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;display:inline-block;">or</div> Sign Up</div>` +
            `<div style="    position: relative;
            max-width: 98%;
            width: 304.195px;
            margin: auto;"  class="boxemailcerthiswallet">` +
            '<div id="' +
            id_insert +
            `-ErrorMessageCerthisWallet" style="border-radius: 8px;
            border: 1px solid #FC6B6B;
            color: ${r_color}
            font-size: 12px;
            margin: auto;
            display: none;
            font-style: normal;
            transition: opacity 0.5s ease 0s, visibility 0.5s ease 0s;
            opacity: 0;
            visibility: hidden;
            gap: 10px;
            padding-left: 14px;
            width: 100%;
            font-weight: 500;
            line-height: normal;
            height: 41px;
            margin-bottom: 16px;
            align-items: center;
            justify-content: flex-start;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/close_p_w.png"style="width: 13px;height: 13px;${invert_img}" > Invalid Email Address</div>` +
            '<input type="email"  id="' +
            id_insert +
            '-certhisWalletEmail"  class="inputemailcerthiswallet" placeholder="Your email" style="margin-top: 40px;    display: block;    margin: auto;    margin-bottom: 20px;    background: #FFFFFF 0% 0% no-repeat padding-box;    border-radius: 26px;    border: ' +
            border_input +
            '    padding: 13px;    padding-left: 20px;    padding-right: 20px;    background: #F8F8F8;    border-radius: 8px;    font-weight: 300;    font-size: 15px;    padding-right: 118px;color: #505050;    padding-right: 10px;width: 100%;">' +
            '<button id="' +
            id_insert +
            `-connectCerthis" style="padding: 5px;
            padding-right: 25px;
            padding-left: 25px;
            width: 100%;
            top: -11px;
            right: 12px;
            color: ${color_button}
            font-size: 15px;
            font-style: normal;
            font-weight: 800;
            line-height: 24.748px;
            height: 49px;
            border-radius: 8.249px;
            border: 1.031px solid #FFF;
            margin-bottom: 45px;
            background: ${bg_button}
            box-shadow: 0px 1.03117px 2.06234px 0px rgba(16, 24, 40, 0.05);
        " >Connect</button>` +
            "</div></div>" +
            `<div style="margin-bottom: 16px;
            margin-top: 15px;
            font-size: 14px;
            color: #616161;" class="alternatetextcerthiswallet"> ` +
            text_wallet_connect_with +
            " </div>" +
            '<div class="' +
            custom_prefix +
            `certhisWalletPart2" style="color: #000000;
            gap: 59px;
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
        ">` +
            '<button id="' +
            id_insert +
            `-certhis-metamask-button" style="    border-radius: 9.695px;
            background: #FFF;
            border: none;
            width: 61.399px;
            display: flex;
            height: 53.32px;
            box-shadow: 0px 2.15436px 8.07883px -0.53859px rgba(130, 130, 130, 0.25);
            align-items: center;
            justify-content: center;"><img src="` +
            metamask_logo +
            '" style="vertical-align: middle;height: 30px;" ></button>' +
            '<button  id="' +
            id_insert +
            `-certhis-walletconnect-button" class="certhisWalletButton" style="    border-radius: 9.695px;
            background: #FFF;
            border: none;
            width: 61.399px;
            display: flex;
            height: 53.32px;
            box-shadow: 0px 2.15436px 8.07883px -0.53859px rgba(130, 130, 130, 0.25);
            align-items: center;
            justify-content: center;` +
            show_wallet_connect +
            '"><img src="' +
            wallet_connect_logo +
            '"  style="vertical-align: middle;height: 30px;" ></button>' +
            '<button id="' +
            id_insert +
            `-certhis-coinbase-button" style="    border-radius: 9.695px;
            background: #FFF;
            border: none;
            width: 61.399px;
            display: flex;
            height: 53.32px;
            box-shadow: 0px 2.15436px 8.07883px -0.53859px rgba(130, 130, 130, 0.25);
            align-items: center;
            justify-content: center;` +
            show_coinbase_connect +
            '"><img src="' +
            coinbase_logo +
            '" style="vertical-align: middle;height: 30px;" ></button>' +
            `</div><div style="font-size: 10px;
            color: #616161;
            width: 315px;
            margin: auto;
            margin-top: 17px;
            margin-bottom: 29px;" class="certhiswallettou">* By connecting your wallet, you accept our <a href="https://certhis.io/terms-of-use">Terms of Use</a> and acknowledge that you have read our <a href="https://certhis.io/privacy-policy">Privacy Policy</a>.</div>${powered_brand}</div>` +
            '<div style="display:none;flex-direction: column;" id="' +
            id_insert +
            '-step2CerthisWallet">' +
            `<div style="display: flex; flex-direction: column; align-items: flex-start; border-radius: 28px; background: ${bg_box}"> ` +
            `
            <img src="${certhis_icon}" style="width: 40px;
            position: absolute;
            left: 27px;
            top: 22px;" >
            <div style="width: 100%;
            display: flex;
            align-items: center;
            margin-top: 22px;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            line-height: normal;
            color: #fff;
            justify-content: center;
          
            margin-top: 33px;
    margin-bottom: 11px;
  
        ">${header_wallet}</div>` +
            `<div style="position: relative;
            max-width: 98%;
            width: 304.195px;
            margin: auto;
            margin-top: 11px;"><div class="` +
            custom_prefix +
            `certhisWalletEmailReceive1" style="border-radius: 8px;
            border: ${r_border}
            color: ${r_color}
            font-size: 12px;
            margin: auto;
            display: flex;
            font-style: normal;
            transition: opacity 0.5s ease 0s, visibility 0.5s ease 0s;
            gap: 10px;
            padding-left: 14px;
            width: 100%;
            font-weight: 500;
            line-height: normal;
            height: 41px;
            margin-bottom: 16px;
            align-items: center;
            justify-content: flex-start;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/check_p_w.png"style="width: 13px;height: 13px;" >You have received a code via email.</div>` +
            '<div id="' +
            id_insert +
            `-ErrorMessageCerthisWalletAuthCode"  style="border-radius: 8px;
            border: 1px solid #FC6B6B;
            color: ${r_color}
            font-size: 12px;
            margin: auto;
            display: none;
            font-style: normal;
            transition: opacity 0.5s ease 0s, visibility 0.5s ease 0s;
            opacity: 0;
            visibility: hidden;
            gap: 10px;
            padding-left: 14px;
            width: 100%;
            font-weight: 500;
            line-height: normal;
            height: 41px;
            margin-bottom: 16px;
            align-items: center;
            justify-content: flex-start;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/close_p_w.png" style="width: 13px;height: 13px;${invert_img}" > Invalid Code </div>` +
            `</div><div style="position: relative;
            max-width: 98%;
            width: 304.195px;
            margin: auto;
            margin-top: 11px;
            display: flex;justify-content: space-between;">` +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox" id="' +
            id_insert +
            '-certhis-code-1" style="width: 50px; height: 50px; margin-right: 3px; display: inline-block; border: none; border-radius: 5.594px; background: #F4F4F4; text-align: center; font-size: 21px; color: #121212;border:' +
            border_input +
            '" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-2" style="width: 50px; height: 50px; margin-right: 3px; display: inline-block; border: none; border-radius: 5.594px; background: #F4F4F4; text-align: center; font-size: 21px; color: #121212; border:' +
            border_input +
            '" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-3" style="width: 50px; height: 50px; margin-right: 3px; display: inline-block; border: none; border-radius: 5.594px; background: #F4F4F4; text-align: center; font-size: 21px; color: #121212;border:' +
            border_input +
            '" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-4" style="width: 50px; height: 50px; margin-right: 3px; display: inline-block; border: none; border-radius: 5.594px; background: #F4F4F4; text-align: center; font-size: 21px; color: #121212;border:' +
            border_input +
            '" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-5" style="width: 50px; height: 50px; margin-right: 3px; display: inline-block; border: none; border-radius: 5.594px; background: #F4F4F4; text-align: center; font-size: 21px; color: #121212;border:' +
            border_input +
            '" maxlength="1">' +
            `</div>` +
            '<button id="' +
            id_insert +
            `-validCodeCerthisWallet" style="    display: flex;
            padding: 12.374px 0px;
            justify-content: center;
            align-items: center;
            gap: 61.87px;
            flex: 1 0 0;
            border: none;
            position: relative;
            max-width: 98%;
            width: 304.195px;
            margin: auto;
            margin-top: 16px;
            border-radius: 8.249px;
            border: 1.031px solid #FFF;
            color: ${color_button}
            font-size: 15px;
            font-style: normal;
            font-weight: 800;
            line-height: 24.748px;
            background: ${bg_button}
            box-shadow: 0px 1.03117px 2.06234px 0px rgba(16, 24, 40, 0.05);
        "  class="` +
            custom_prefix +
            'certhisWalletValidCode">Connect Now</button>' +
            `<div style="margin: auto;
            margin-bottom: 19px;
            margin-top: 24px;
            color: ${g_color}
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: lighter;
            line-height: 20px;">Didn\'t received the code? <span id="` +
            id_insert +
            '-certhiswalletResend" style="    text-decoration: underline;cursor: pointer;width: fit-content;display: inline-block;">Resend</span></div>' +
            "</div><div>" +
            '<div id="' +
            id_insert +
            '-certhisWalletPrevious" class="' +
            custom_prefix +
            `certhisWalletPrevious" style="color: #616161;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            display: flex;
            line-height: normal;
            gap: 30px;
            margin-top: 31px;
            margin-bottom: 24px;
            margin-right: 30px;
            align-items: center;
            justify-content: center;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/left_b.png"style="width: 30px;
            height: 30px;" >Back</div>` +
            "</div>" +
            "</div>" +
            '<div style="text-align:center;display:none;" id="' +
            id_insert +
            '-step3CerthisWallet">' +
            `<div style="display: flex; flex-direction: column; align-items: flex-start; border-radius: 28px; background:${bg_box}"> ` +
            `
            <img src="${certhis_icon}" style="width: 40px;
            position: absolute;
            left: 27px;
            top: 22px;" >
            <div style="width: 100%;
            display: flex;
            align-items: center;
            margin-top: 22px;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            line-height: normal;
            color: #fff;
            justify-content: center;
          
            margin-top: 33px;
    margin-bottom: 11px;
  
        ">${header_wallet}</div>` +
            `<div style="    display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 42px;
            margin-top: 51px;
            margin-bottom: 112px;" id="m_s_p_o"><img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/v2/g_1.gif" id="l_g_popup" style="width: 51px;
            height: 51px;${d_none}"/><img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/v2/g_m.gif" id="m_g_popup"  style="width: 87px;
            height: 87px;" /><img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/v2/g_1.gif"  id="r_g_popup"  style="width: 51px;
            height: 51px;${d_none}" /></div>` +
            `<div style="width: 100%;
            color: ${r_color};
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: 800;
            line-height: normal;margin-bottom:60px;display:none;" id="success_connect_c_p">Connected with <div style="display: inline-block;color: #72F6FE; font-size: 16px; font-style: normal; font-weight: 800; line-height: normal;">Success</div></div>` +
            `</div>` +
            `<div style="color: #616161;
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            margin-top: 31px;
            margin-bottom: 24px;display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;cursor:pointer;" id="success_connect_c_p_t">In Process</div>` +
            "</div>";

          if (id_insert == "popupCerthis") {
            InsertHTMLBOX = InsertHTMLBOX + "</div>";
          }

          boxCerthis.innerHTML = translate.applyTranslations(InsertHTMLBOX);

          if (id_insert == "popupCerthis") {
            document.body.appendChild(boxCerthis);
          }

          for (let i = 1; i <= 5; i++) {
            const input = document.querySelector(
              `#${id_insert}-certhis-code-${i}`
            );
            input.addEventListener("input", function (event) {
              const value = event.target.value;
              if (value.length === 1) {
                const nextInput = document.querySelector(
                  `#${id_insert}-certhis-code-${
                    Number(event.target.id.split("-")[3]) + 1
                  }`
                );

                if (Number(event.target.id.split("-")[3]) == 5) {
                  validCode();
                }
                nextInput.focus();
              }
            });

            input.addEventListener("keydown", function (event) {
              const previousInput = document.querySelector(
                `#${id_insert}-certhis-code-${
                  Number(event.target.id.split("-")[3]) - 1
                }`
              );

              if (
                event.key === "Backspace" &&
                event.target.value.length === 0
              ) {
                if (Number(event.target.id.split("-")[3]) >= 2) {
                  previousInput.focus();
                }
              }
            });

            input.addEventListener("paste", function (event) {
              event.preventDefault();
              const paste = event.clipboardData.getData("text");
              if (paste.length >= 5) {
                for (let j = 1; j <= 5; j++) {
                  document.querySelector(
                    `#${id_insert}-certhis-code-${j}`
                  ).value = paste[j - 1];
                }
                validCode();
              }
            });
          }

          const step1 = document.querySelector(
            "#" + id_insert + "-step1CerthisWallet"
          );
          const step2 = document.querySelector(
            "#" + id_insert + "-step2CerthisWallet"
          );
          const step3 = document.querySelector(
            "#" + id_insert + "-step3CerthisWallet"
          );

          const success_connect_c_p = document.querySelector(
            "#success_connect_c_p"
          );

          const success_connect_c_p_t = document.querySelector(
            "#success_connect_c_p_t"
          );

          //l_g_popup
          const l_g_popup = document.querySelector("#l_g_popup");
          const m_g_popup = document.querySelector("#m_g_popup");
          const r_g_popup = document.querySelector("#r_g_popup");

          //m_s_p_o
          const m_s_p_o = document.querySelector("#m_s_p_o");

          if (id_insert == "popupCerthis") {
            const closePopup = document.querySelector(
              "#" + id_insert + "-closePopup"
            );
            var checkclosePopup = closePopup.addEventListener(
              "click",
              function () {
                var popupCerthis = document.getElementById("popupCerthis");
                //remove popup
                popupCerthis.remove();
              }
            );
          }

          const certhisCoinbase = document.querySelector(
            "#" + id_insert + "-certhis-coinbase-button"
          );
          var checkCoinbase = certhisCoinbase.addEventListener(
            "click",
            async function () {
              var LoadCoinbase = new InjectCoinbase({
                appName: "Certhis Wallet",
                appLogoUrl: "https://certhis.io/assets/images/logo.png",
                darkMode: false,
                overrideIsMetaMask: false,
              });
              try {
                var provider = LoadCoinbase.makeWeb3Provider(rpcUrl, rpcId);
                await provider.send("eth_requestAccounts");
                storageC.localStorageAdaptater.setItem(
                  "WALLET_TYPE",
                  "COINBASE"
                );
                storageC.localStorageAdaptater.setItem("CONNECTED", true);
                boxCerthis.style.display = "none";
                storageC.localStorageAdaptater.setItem(
                  "IS_WALLET_CERTHIS",
                  false
                );

                resolve(provider);
                step1.style.display = "block";
                step2.style.display = "none";
                step3.style.display = "none";
              } catch (e) {
                console.log(e);
              }
            }
          );

          const certhisWalletConnect = document.querySelector(
            "#" + id_insert + "-certhis-walletconnect-button"
          );
          var checkcerthisWalletConnect = certhisWalletConnect.addEventListener(
            "click",
            async function () {
              try {
                try {
                  const provider = await EthereumProvider.init({
                    projectId: "2b30b85274289d9784546715b058dac8", // REQUIRED your projectId
                    chains: [rpcId], // REQUIRED chain ids
                    // optionalChains: [137, 1, 80001, 5, 97, 56, 43113, 43114],
                    showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
                    // REQUIRED ethereum methods
                    methods: ["eth_sendTransaction", "personal_sign"],
                    optionalMethods: [
                      "eth_sign",
                      "eth_signTransaction",
                      "eth_signTypedData",
                      "wallet_switchEthereumChain",
                      "wallet_addEthereumChain",
                    ],
                    optionalEvents: ["chainChanged", "accountsChanged"], // REQUIRED ethereum events,

                    //get current url
                    metadata: {
                      name: "Certhis Wallet",
                      url: window.location.href,
                      description:
                        "Experience seamless Web3 navigation with Certhis Wallet.",
                      icons: ["https://cdn.certhis.io/images/FAVICON.png"],
                    },
                  });

                  await provider.connect();

                  storageC.localStorageAdaptater.setItem(
                    "WALLET_TYPE",
                    "WALLETCONNECT"
                  );
                  storageC.localStorageAdaptater.setItem("CONNECTED", true);
                  boxCerthis.style.display = "none";

                  storageC.localStorageAdaptater.setItem(
                    "IS_WALLET_CERTHIS",
                    false
                  );

                  resolve(provider);
                  step1.style.display = "block";
                  step2.style.display = "none";
                  step3.style.display = "none";
                } catch (e) {
                  // statements
                  console.log(e);
                }
              } catch (e) {
                reject(e);
              }
            }
          );

          const certhisMetamask = document.querySelector(
            "#" + id_insert + "-certhis-metamask-button"
          );
          var checkMetamask = certhisMetamask.addEventListener(
            "click",
            async function () {
              if (window.ethereum) {
                if (window.ethereum.isMetaMask == true) {
                  try {
                    try {
                      const accounts = await window.ethereum.enable();
                      storageC.localStorageAdaptater.setItem(
                        "WALLET_TYPE",
                        "METAMASK"
                      );
                      storageC.localStorageAdaptater.setItem("CONNECTED", true);
                      boxCerthis.style.display = "none";
                      storageC.localStorageAdaptater.setItem(
                        "IS_WALLET_CERTHIS",
                        false
                      );

                      resolve(window.ethereum);
                      step1.style.display = "block";
                      step2.style.display = "none";
                      step3.style.display = "none";
                    } catch (e) {
                      // statements
                      console.log(e);
                    }
                  } catch (error) {
                    //popup install metamask
                    window.open("https://metamask.io/download/", "_blank");
                  }
                } else {
                  window.open("https://metamask.io/download/", "_blank");
                }
              } else {
                //popup install metamask

                if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                  window.open(
                    "https://metamask.app.link/dapp/" +
                      document.URL.split("//")[1]
                  );
                } else {
                  window.open("https://metamask.io/download/", "_blank");
                }
              }
            }
          );

          var certhiswalletResend = document.querySelector(
            "#" + id_insert + "-certhiswalletResend"
          );

          var certhiswalletResendN = certhiswalletResend.cloneNode(true);

          certhiswalletResend.parentNode.replaceChild(
            certhiswalletResendN,
            certhiswalletResend
          );
          var blockResend = false;
          var checkcerthiswalletSecurityResend =
            certhiswalletResendN.addEventListener("click", async function () {
              if (blockResend == false) {
                blockResend = true;

                let time = 0;

                var interval = setInterval(() => {
                  var time_to_show = 30 - time;
                  certhiswalletResendN.textContent = `Code Sent. ( Wait ${time_to_show} Secondes for a new code )`;
                  time++;

                  certhiswalletResendN.style["text-decoration"] = "none";

                  if (time_to_show <= 1) {
                    certhiswalletResendN.textContent = `Resend`;
                    certhiswalletResendN.style["text-decoration"] = "underline";
                  }

                  if (time >= 30) {
                    clearInterval(interval);
                  }
                }, 1000);

                const emailInput = document.querySelector(
                  "#" + id_insert + "-certhisWalletEmail"
                );
                const email = emailInput.value;

                var send_auth = await certhisWallet.auth(email);

                setTimeout(() => {
                  blockResend = false;
                  certhiswalletResendN.style["text-decoration"] = "underline";
                  certhiswalletResendN.textContent = "Resend";
                }, 22000);
              }
            });

          const certhisWalletPrevious = document.querySelector(
            "#" + id_insert + "-certhisWalletPrevious"
          );
          var checkPrevious = certhisWalletPrevious.addEventListener(
            "click",
            function () {
              connectCerthis.classList.remove("CerthisWalletLoading");
              step2.style.display = "none";
              step1.style.display = "block";
            }
          );

          const connectCerthis = document.querySelector(
            "#" + id_insert + "-connectCerthis"
          );

          var checkConnect = connectCerthis.addEventListener(
            "click",
            async function () {
              const emailInput = document.querySelector(
                "#" + id_insert + "-certhisWalletEmail"
              );
              const email = emailInput.value;
              // Use a regular expression to check if the email is in a valid format
              const emailRegex =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              const isValidEmail = emailRegex.test(email);
              const ErrorMessageCerthisWallet = document.querySelector(
                "#" + id_insert + "-ErrorMessageCerthisWallet"
              );
              if (isValidEmail) {
                connectCerthis.classList.add("CerthisWalletLoading");
                ErrorMessageCerthisWallet.style.display = "none";
                ErrorMessageCerthisWallet.style.opacity = "0";
                ErrorMessageCerthisWallet.style.visibility = "hidden";

                //generate wallet
                var get_wallet = await certhisWallet.wallet(email);
                get_wallet = get_wallet.data;
                var wallet = get_wallet.wallet;
                var send_auth = await certhisWallet.auth(email);
                send_auth = send_auth.data;
                storageC.localStorageAdaptater.setItem(
                  "WALLET_CERTHIS",
                  wallet
                );
                step1.style.display = "none";
                step2.style.display = "flex";
                connectCerthis.classList.remove("CerthisWalletLoading");
              } else {
                ErrorMessageCerthisWallet.style.display = "flex";
                setTimeout(() => {
                  ErrorMessageCerthisWallet.style.opacity = "1";
                  ErrorMessageCerthisWallet.style.visibility = "visible";
                }, 100);
              }
            }
          );

          const validCodeCerthisWallet = document.querySelector(
            "#" + id_insert + "-validCodeCerthisWallet"
          );
          let validBlock = false;
          var checkValidCode = validCodeCerthisWallet.addEventListener(
            "click",
            function () {
              validCode();
            }
          );

          async function validCode() {
            const ErrorMessageCerthisWalletAuthCode = document.querySelector(
              "#" + id_insert + "-ErrorMessageCerthisWalletAuthCode"
            );

            let code = "";
            for (let i = 1; i <= 5; i++) {
              const input = document.querySelector(
                `#${id_insert}-certhis-code-${i}`
              );
              code += input.value;
            }

            const isValid = /^[A-Za-z0-9]{5}$/.test(code);

            if (validBlock == false) {
              validBlock = true;
              if (isValid) {
                ErrorMessageCerthisWalletAuthCode.style.display = "None";

                step2.style.display = "None";
                step3.style.display = "block";

                const emailInput = document.querySelector(
                  "#" + id_insert + "-certhisWalletEmail"
                );
                const email = emailInput.value;

                var wallet_check =
                  storageC.localStorageAdaptater.getItem("WALLET_CERTHIS");
                if (
                  wallet_check == undefined ||
                  wallet_check == null ||
                  wallet_check == ""
                ) {
                  var get_wallet = await certhisWallet.wallet(email);
                  get_wallet = get_wallet.data;
                  wallet_check = get_wallet.wallet;
                }

                var validCode = await certhisWallet.check(wallet_check, code);

                validCode = validCode.data;
                if (validCode == undefined) {
                  validCode = {};
                }
                if (validCode.encrypted_key != undefined) {
                  storageC.localStorageAdaptater.setItem(
                    "WALLET_ECRYPTED_KEY",
                    validCode.encrypted_key
                  );
                  storageC.localStorageAdaptater.setItem("WALLET_EMAIL", email);

                  var getProvider = await providerFunction.getProvider(
                    rpcUrl,
                    storageC.localStorageAdaptater.getItem("WALLET_CERTHIS"),
                    validCode.encrypted_key
                  );

                  storageC.localStorageAdaptater.setItem("CONNECTED", true);

                  //IS_WALLET_CERTHIS
                  storageC.localStorageAdaptater.setItem(
                    "IS_WALLET_CERTHIS",
                    true
                  );

                  resolve(getProvider);

                  success_connect_c_p.style.display = "block";
                  m_s_p_o.style.marginBottom = "45px";
                  //change text to close of #success_connect_c_p_t
                  success_connect_c_p_t.innerHTML =
                    '<img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/p_close_b.png" style="width: 12px;height: 12px;">Close';
                  //on click success_connect_c_p_t
                  success_connect_c_p_t.addEventListener("click", function () {
                    step1.style.display = "block";
                    step2.style.display = "none";
                    step3.style.display = "none";

                    if (id_insert == "popupCerthis") {
                      boxCerthis.remove();
                    }
                  });

                  //l_g_popup
                  l_g_popup.style.display = "none";
                  r_g_popup.style.display = "none";
                  //change src of #m_g_popup
                  m_g_popup.src =
                    "https://utility-apps-assets.certhis.io/certhisWallet/v2/p_b_s.png";

                  //remove popup after 5s
                  setTimeout(() => {
                    if (id_insert == "popupCerthis") {
                      boxCerthis.remove();
                    }
                  }, 3000);
                } else {
                  ErrorMessageCerthisWalletAuthCode.style.display = "flex";
                  setTimeout(() => {
                    ErrorMessageCerthisWalletAuthCode.style.opacity = "1";
                    ErrorMessageCerthisWalletAuthCode.style.visibility =
                      "visible";
                  }, 100);
                  step2.style.display = "flex";
                  step3.style.display = "None";
                  validBlock = false;
                }
              } else {
                ErrorMessageCerthisWalletAuthCode.style.display = "flex";
                setTimeout(() => {
                  ErrorMessageCerthisWalletAuthCode.style.opacity = "1";
                  ErrorMessageCerthisWalletAuthCode.style.visibility =
                    "visible";
                }, 100);
                validBlock = false;
              }
            }
          }
        } else if (boxCerthis) {
          boxCerthis.style.display = "grid";
        } else if (return_provider != null) {
          storageC.localStorageAdaptater.setItem("IS_WALLET_CERTHIS", false);
          resolve(false);
        }
      });
    },
  };
};
