"use strict";

/**
 * @module certhis-wallet
 */

module.exports = function () {
  const { Web3 } = require("web3");
  var storageC = require("./storageAdaptater");
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

  const request = require("./request")("https://elb-wallet.certhis.io/");
  const certhisWallet = require("./certhisWallet")(request);

  const CryptoJS = require("crypto-js");
  const rpcinfo = require("./rpc");
  var rpc_array = rpcinfo.rpc_array;

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
    const rpcinfo = require("./rpc");
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
            transactionInformation.erc20_amount /
            Math.pow(10, transactionInformation.erc20_decimals);
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
        storageC.localStorageAdaptater.setItem(
          "last_transaction_in_temp",
          JSON.stringify({
            timer: new Date().getTime(),
            functionGasFees: String(functionGasFees),
            address: address,
            value: value_temp,
            chain_id: chain_id,
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
            transactionInformation.erc20_amount /
            Math.pow(10, transactionInformation.erc20_decimals);

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
              balance_erc20 /
              Math.pow(10, transactionInformation.erc20_decimals);
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
              amount_missing_erc20 /
              Math.pow(10, transactionInformation.erc20_decimals);
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
            '<div style="    color: #b8b8b8;font-size: 14px;text-align: center;margin-bottom: 30px; margin-top: 30px;">You need additional credits in your wallet to pay the transaction.</div> ';

          if (transactionInformation.erc20 != true) {
            if (rpcinfo.rpc_type[chain_id] == "mainnet") {
              active_showBoxTransacCerthisWallet = true;
              InsertHTMLBOX =
                InsertHTMLBOX +
                '<img style="width: 116px;max-width: 100%;" src="https://utility-apps-assets.certhis.io/certhisWallet/pay.png"><button style="display: block; margin: auto;width: 100%;border: none;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);border-radius: 59px;color: #fff;padding: 8px;margin-bottom: 20px;margin-top: 20px;font-family: system-ui;" id="showBoxTransacCerthisWallet">Pay via Credit Card</button>';
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

        InsertHTMLBOX =
          InsertHTMLBOX +
          "</div>" +
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
      const rpcinfo = require("./rpc");
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
        resolve(null);
      });
    },
    storageC: storageC,
    run: async function (args) {
      var rpc_id = args.rpc_id;
      var rpc = args.rpc;
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

      var version_wallet_logo = 1;
      if (args.version_wallet_logo != undefined) {
        version_wallet_logo = args.version_wallet_logo;
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
        style.textContent =
          '.CerthisWalletLoading{  padding-right: 41px !important;}  .CerthisWalletLoading::after {content: "";    position: absolute;    width: 16px;    height: 16px;    margin-top: 2px;    margin-left: 13px;    border: 2px solid transparent;    border-color: #000000 transparent #000000 transparent;    border-radius: 50%;    animation: CerthisWalletLoading-spinner 1s ease infinite;} @keyframes CerthisWalletLoading-spinner {  from {    transform: rotate(0turn);  }  to {    transform: rotate(1turn);  }} .certhisWalletStyle a {color:#000 !important} .certhisWallet { font-family: arial !important;} .certhisWalletStyle button{font-family: Arial!important;;} .certhisWalletStyle button:hover{     box-shadow: 0px 0px 0px rgb(0 0 0 / 24%), 0px 1px 4px rgb(0 0 0 / 25%)!important; }  .certhisWalletStyle input::placeholder { font-family:Arial!important;; }  @media only screen and (max-width:500px) { #popup-content-certhis{ width:95%!important;; } }';
        document.body.appendChild(style);

        //disable certhis wallet engine
        var display_none_certhis_wallet = "";
        var text_wallet_connect_with = "Or";

        if (
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != undefined &&
          storageC.localStorageAdaptater.getItem("RPC_CERTHIS") != ""
        ) {
          var rpcUrl = storageC.localStorageAdaptater.getItem("RPC_CERTHIS");
        } else {
          var rpcUrl = rpc;
          storageC.localStorageAdaptater.setItem("RPC_CERTHIS", rpc);
        }

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
          storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS") != ""
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
            resolve(provider);
          } else {
            var getProvider = await providerFunction.getProvider(
              rpcUrl,
              storageC.localStorageAdaptater.getItem("WALLET_CERTHIS"),
              storageC.localStorageAdaptater.getItem("WALLET_ECRYPTED_KEY")
            );

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
            InsertHTMLBOX =
              '<div id="' +
              id_insert +
              '-box-content-certhis" style="width: auto;    position: relative;    padding: 23px;    min-height: 300px;    display: grid;    align-content: center;    margin: auto;    max-width: 95%;    background: #ffffff;    border-radius: 10px;    box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);">' +
              '<div id="' +
              id_insert +
              '-closePopup" style="position: absolute;width: fit-content;right: 15px;cursor: pointer;top: 15px;"><img src="https://cdn.certhis.io/images/close_b_a_d.svg"></div>';
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
            'certhisWalletPart1" style="text-align:center;' +
            display_none_certhis_wallet +
            '">' +
            '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="max-height: 35px;margin-top: 25px;" >' +
            '<div style="font-size:25px;text-align: center;font-size: 20px;margin-top: 30px;text-align: center;color: #505050;" class="certhiswalletfirst_text">Don\'t have a wallet Yet ?</div>' +
            '<div  style="font-size: 14px;    margin-bottom: 25px;color: #807979;font-weight: 300;    margin-top: 10px;" class="certhiswalletsecond_text">Enter your email, connect and instantly start your Web3 journey</div>' +
            '<div id="' +
            id_insert +
            '-ErrorMessageCerthisWallet" style="display:none;color:red;"></div>' +
            '<div style="    position: relative;width: fit-content;margin: auto;"  class="boxemailcerthiswallet"><input type="email"  id="' +
            id_insert +
            '-certhisWalletEmail"  class="inputemailcerthiswallet" placeholder="Your email" style="margin-top: 40px;    display: block;    margin: auto;    margin-bottom: 20px;    background: #FFFFFF 0% 0% no-repeat padding-box;    border-radius: 26px;    border: 0;    padding: 13px;    padding-left: 20px;    padding-right: 20px;    background: #F8F8F8;    border-radius: 8px;    font-weight: 300;    font-size: 15px;    padding-right: 118px;color: #505050;">' +
            '<button id="' +
            id_insert +
            '-connectCerthis" style="background: #FFFFFF 0% 0% no-repeat padding-box; box-shadow: 0px 0px 14px #00000029; border: none; font-size: 14px; padding: 5px; margin-top: 20px; padding-right: 25px; padding-left: 25px; border-radius: 26px; margin-bottom: 30px; position: absolute; color: #fff; font-weight: 300; top: -11px; right: 12px; background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%); border-radius: 59px;" >Connect</button>' +
            "</div></div>" +
            '<div style="margin-bottom: 25px; margin-top: 25px; font-size: 14px; color: #807979;" class="alternatetextcerthiswallet"> ' +
            text_wallet_connect_with +
            " </div>" +
            '<div class="' +
            custom_prefix +
            'certhisWalletPart2" style="color:#000000;">' +
            '<button id="' +
            id_insert +
            '-certhis-metamask-button" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;text-align: left;padding-left: 17px;display: flex;margin-bottom: 30px;margin-top: 20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;justify-content: space-between;"><img src="' +
            metamask_logo +
            '" style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;" class="connectbtnmcerthiswallet" >Connect</div></button>' +
            '<button  id="' +
            id_insert +
            '-certhis-walletconnect-button" class="certhisWalletButton" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;text-align: left;padding-left: 17px;display: flex;margin-bottom: 30px;margin-top: 20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;justify-content: space-between;' +
            show_wallet_connect +
            '"><img src="' +
            wallet_connect_logo +
            '"  style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;" class="connectbtnmcerthiswallet">Connect</div></button>' +
            '<button id="' +
            id_insert +
            '-certhis-coinbase-button" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;text-align: left;padding-left: 17px;display: flex;margin-bottom: 30px;margin-top: 20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;justify-content: space-between;' +
            show_coinbase_connect +
            '"><img src="' +
            coinbase_logo +
            '" style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;" class="connectbtnmcerthiswallet" >Connect</div></button>' +
            '</div><div style="font-size: 12px;color: #807979;width: 250px;margin: auto;margin-top: 40px;margin-bottom:10px;" class="certhiswallettou">* By connecting your wallet, you accept our <a href="https://certhis.io/terms-of-use">Terms of Use</a> and acknowledge that you have read our <a href="https://certhis.io/privacy-policy">Privacy Policy</a>.</div></div>' +
            '<div style="text-align:center;display:none;" id="' +
            id_insert +
            '-step2CerthisWallet">' +
            '<div id="' +
            id_insert +
            '-certhisWalletPrevious" class="' +
            custom_prefix +
            'certhisWalletPrevious" style="cursor: pointer;    margin-top: 20px;    margin-right: auto;    text-align: left;    margin-left: 20px;    font-size: 13px;    width: fit-content;    margin-bottom: 20px;    text-transform: capitalize;    color: #505050;    position: absolute;    display: block;    top: 0;    left: 0;">&#8592 previous</div>' +
            '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="max-height: 35px;margin-top: 30px;margin-bottom: 20px;" class="' +
            custom_prefix +
            'certhisWalletLogo">' +
            '<div style="margin-bottom: 20px;"><div class="' +
            custom_prefix +
            'certhisWalletEmailReceive1" style="color: #505050;font-size: 20px;margin-top: 5px;">You have received a code via email.</div><div  class="' +
            custom_prefix +
            'certhisWalletEmailReceive2" style="color: #807979;margin-top: 5px;">Please enter the code to log in</div></div>' +
            '<div id="' +
            id_insert +
            '-ErrorMessageCerthisWalletAuthCode" style="margin-bottom: 20px;display:none;color:red;"></div>' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox" id="' +
            id_insert +
            '-certhis-code-1" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-2" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-3" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-4" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text" class="' +
            custom_prefix +
            'certhisWalletCodeBox"  id="' +
            id_insert +
            '-certhis-code-5" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<div style="    margin: auto;font-size: 13px;margin-bottom: 20px;margin-top: 30px;color: #807979;line-height: 21px;max-width: 295px;">Didn\'t received the code? <span id="' +
            id_insert +
            '-certhiswalletResend" style="    text-decoration: underline;cursor: pointer;width: fit-content;display: inline-block;">Resend</span></div>' +
            '<button id="' +
            id_insert +
            '-validCodeCerthisWallet" style="width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;       border: none;    border-radius: 50px;    color: #fff;   padding: 5px;padding-left: 35px;padding-right: 35px;   background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;"  class="' +
            custom_prefix +
            'certhisWalletValidCode">Connect Now</button>' +
            "</div>" +
            '<div style="text-align:center;display:none;" id="' +
            id_insert +
            '-step3CerthisWallet">' +
            '<div style="    margin-bottom: 20px;">Validating Code ...</div>' +
            '<img alt="" src="https://utility-apps-assets.certhis.io/certhisWallet/load.svg" />' +
            "</div>";

          if (id_insert == "popupCerthis") {
            InsertHTMLBOX = InsertHTMLBOX + "</div>";
          }

          boxCerthis.innerHTML = InsertHTMLBOX;

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
          if (id_insert == "popupCerthis") {
            const closePopup = document.querySelector(
              "#" + id_insert + "-closePopup"
            );
            var checkclosePopup = closePopup.addEventListener(
              "click",
              function () {
                storageC.localStorageAdaptater.removeItem("CONNECTED");
                storageC.localStorageAdaptater.removeItem("WALLET_CERTHIS");
                storageC.localStorageAdaptater.removeItem(
                  "WALLET_ECRYPTED_KEY"
                );

                var popupCerthis = document.getElementById("popupCerthis");
                popupCerthis.style.display = "none";
              }
            );
          }

          const certhisCoinbase = document.querySelector(
            "#" + id_insert + "-certhis-coinbase-button"
          );
          var checkCoinbase = certhisCoinbase.addEventListener(
            "click",
            async function () {
              certhisCoinbase.children[1].classList.add("CerthisWalletLoading");
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
              certhisWalletConnect.children[1].classList.add(
                "CerthisWalletLoading"
              );
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
              certhisMetamask.children[1].classList.add("CerthisWalletLoading");
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
                  var time_to_show = 220 - time;
                  certhiswalletResendN.textContent = `Code Sent. ( Wait ${time_to_show} Secondes for a new code )`;
                  time++;

                  certhiswalletResendN.style["text-decoration"] = "none";

                  if (time >= 220) {
                    clearInterval(interval);
                  }
                }, 1000);

                var send_auth = await certhisWallet.auth(
                  storageC.localStorageAdaptater.getItem("WALLET_EMAIL")
                );

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
                ErrorMessageCerthisWallet.style.display = "None";

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
                step2.style.display = "block";
              } else {
                ErrorMessageCerthisWallet.textContent = "Invalid Email Address";
                ErrorMessageCerthisWallet.style.display = "block";
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
                  if (id_insert == "popupCerthis") {
                    boxCerthis.style.display = "none";
                  }
                  storageC.localStorageAdaptater.setItem("CONNECTED", true);
                  resolve(getProvider);
                  step1.style.display = "block";
                  step2.style.display = "none";
                  step3.style.display = "none";
                } else {
                  ErrorMessageCerthisWalletAuthCode.textContent =
                    "Invalid Code";
                  ErrorMessageCerthisWalletAuthCode.style.display = "block";
                  step2.style.display = "block";
                  step3.style.display = "None";
                  validBlock = false;
                }
              } else {
                ErrorMessageCerthisWalletAuthCode.textContent =
                  "Invalid Code Format";
                ErrorMessageCerthisWalletAuthCode.style.display = "block";
                validBlock = false;
              }
            }
          }
        } else if (boxCerthis) {
          boxCerthis.style.display = "grid";
        } else if (return_provider != null) {
          resolve(false);
        }
      });
    },
  };
};
