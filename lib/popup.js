module.exports = function (web3) {
  var storageC = require("./storageAdaptater");

  var show_popup = function (
    title = null,
    message = null,
    content = null,
    tx = null
  ) {

    function escapeHTML(text) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    
    return new Promise(async (resolve, reject) => {
      var get_tx = tx;
      var boxPopup = document.getElementById("boxPopupCerthis");
      const rpcinfo = require("./rpc");
      if (boxPopup) {
        boxPopup.remove();
      }
      boxPopup = document.createElement("div");
      boxPopup.id = "boxPopupCerthis";
      boxPopup.style.position = "fixed";
      boxPopup.style.width = "100%";
      boxPopup.style["z-index"] = "100";
      boxPopup.style.height = "100%";
      boxPopup.style.top = 0;
      boxPopup.style.background = "rgb(0 0 0 / 9%)";
      boxPopup.style["backdrop-filter"] = "blur(5px)";
      boxPopup.style["text-align"] = "center";
      boxPopup.style.display = "grid";



      var InsertHTMLBOX =
        '<div id="popup-content-certhis"  style="color: #505050;font-family: Arial !important;    position: relative;    min-height: 300px;    display: grid;    align-content: center;    box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;    margin: auto;    max-width: 95%;    background: #fff;    width: 400px;    border-radius: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border-radius: 5px;    border-radius: 10px;    box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);">' +
      '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="max-height: 35px;    margin-left: 25px;    margin-top: 25px;">' +
        '<div id="closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
        '<div style="margin-top: 15px;margin-bottom: 40px;margin-top: 0px;"></div>'+
        '<div style="  padding-left: 25px;text-align: left;font-size: 23px;margin-bottom: 0px;">' +
        title +
        "</div>";

      if (message != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="    padding-left: 25px;margin-bottom: 60px;font-size: 15px;color: #7A7A7A;width: 82%;text-align: left;">' +
          escapeHTML(message) +
          "</div>";
      }

      if (content != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="padding: 20px;margin: auto;width: fit-content;font-size: 15px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 0px 3px #00000029;">' +
          '<div style="    background-image: url(https://utility-apps-assets.certhis.io/certhisWallet/sign.svg);height: 50px;width: 50px;margin: auto;background-size: 75% 87%;border-radius: 50%;margin-bottom: 10px;border: 1px solid #ccc;background-repeat: no-repeat;background-position: center center;"></div>'+
          '<div style="color: #7A7A7A;margin-bottom: 20px;">'+storageC.localStorageAdaptater.getItem("WALLET_CERTHIS").replace(/(.{3}).*(.{3})/, "$1...$2")+'</div>'+
          content +
          "</div>";
      }

      if (get_tx != null) {
      
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="">' +
          '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;display: flex;">'+
          '<div style="vertical-align: top;display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Recipient</div>'+
          '<div style="font-size: 16px;display: inline-block;width: 50%;text-align: right;padding-right: 15px;"><a href="'+rpcinfo.ether_scan_array[storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")]+'address/'+get_tx.to+'" target="_blank" style="    display: block;color: #579ED5A8;text-decoration: underline;">' +
           get_tx.to.replace(/(.{3}).*(.{3})/, "$1...$2")+
           '</a>'+
          '</div></div>';

        if (get_tx.value != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="   display: flex; border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;">'+
            '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Value</div>'+
            '<div style="font-size: 16px;display: inline-block;width: 50%;text-align: right;padding-right: 15px;">' +
            web3.utils.fromWei(String(BigInt(get_tx.value))) + ' '+rpcinfo.currency_array[storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")]+
            "</div></div>";
        } else {
          InsertHTMLBOX = InsertHTMLBOX + '<div style=" display: flex;   border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;"> '+
          '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Value</div>'+
          '<div style="display: inline-block;width: 50%;font-size: 16px;text-align: right;padding-right: 15px;font-size: 16px;">0 '+rpcinfo.currency_array[storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")]+'</div>'+
          '</div>';
        }

        var gas_price = web3.utils.toWei(String(BigInt(tx.gas)), 'wei');
        var gasPriceInWei = web3.utils.toWei(String(BigInt(tx.gasPrice)), 'wei');
        var totalFeeInWei = gas_price * gasPriceInWei;
        var gas_price = web3.utils.fromWei(String(totalFeeInWei), 'ether');
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="  display: flex;  border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;display: flex;">'+
          '<div style="    display: inline-block;width: fit-content;text-align: left;padding-left: 15px;padding-right: 15px;margin-right: auto;font-size: 16px;">Gas Fee</div>'+
          '<div style="    display: inline-block;width: fit-content;text-align: right;font-size: 16px;padding-right: 15px;">' +
          gas_price +' '+rpcinfo.currency_array[storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")]+
          "</div></div>" +
          "</div>";
          
          var confirm_button = '<button id="confirmPopupLib" style="font-family: arial;width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border: none;    border-radius: 50px;    color: #fff;    padding: 6px;    padding-left: 25px;    padding-right: 25px;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;">Confirm</button>';
     

      }
      else
      {
        var confirm_button = '<button id="confirmPopupLib" style="font-family: arial;width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border: none;    border-radius: 50px;    color: #fff;    padding: 6px;    padding-left: 25px;    padding-right: 25px;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;">Sign</button>';
      }

      InsertHTMLBOX =
        InsertHTMLBOX +
        '<div style="text-align:center;margin-top: 60px;margin-bottom: 25px;">' +
        '<button id="closePopupLib2" style="  font-family: arial;  margin-right: 25px;    width: fit-content;    padding: 5px;    padding-left: 25px;    padding-right: 25px;    font-size: 17px;    cursor: pointer;    border-radius: 50px;    margin-top: 10px;    margin-bottom: 10px;    background: #F8F8F8;    border: none;    color: #505050;">Close</button>' +
        confirm_button+
      "</div>" + "</div>";

      boxPopup.innerHTML = InsertHTMLBOX;

      document.body.appendChild(boxPopup);

      let closePopup = document.querySelector("#closePopupLib");
      var closePopupN = closePopup.cloneNode(true);
      closePopup.parentNode.replaceChild(closePopupN, closePopup);

      closePopupN.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(false);
      });

      let closePopup2 = document.querySelector("#closePopupLib2");
      var closePopup2N = closePopup2.cloneNode(true);
      closePopup2.parentNode.replaceChild(closePopup2N, closePopup2);

      closePopup2N.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(false);
      });

      let confirmPopup = document.querySelector("#confirmPopupLib");
      var confirmPopupN = confirmPopup.cloneNode(true);
      confirmPopup.parentNode.replaceChild(confirmPopupN, confirmPopup);

      confirmPopupN.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(true);
      });
    });
  };

  return {
    showSignPopup: async function (message_to_sign) {
      var getConfirmation = await show_popup(
        "Confirm Message Signature",
        "Please confirm that you want to sign the message with your wallet",
        message_to_sign
      );

      return getConfirmation;
    },
    showTransactionPopup: async function (tx) {
      
      
      var getConfirmation = await show_popup(
        "Confirm Transaction",
        "Please confirm the transaction to continue",
        null,
        tx
      );

      return getConfirmation;
    },
  };
};
