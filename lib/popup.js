module.exports = function (web3) {
  var show_popup = function (
    title = null,
    message = null,
    content = null,
    tx = null
  ) {
    return new Promise(async (resolve, reject) => {
      var get_tx = tx;
      var boxPopup = document.getElementById("boxPopupCerthis");

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
      boxPopup.style.background = "#ffffffa3";
      boxPopup.style["text-align"] = "center";
      boxPopup.style.display = "grid";

      var InsertHTMLBOX =
        '<div id="popup-content-certhis" style="font-family: Arial !important;position: relative;min-height: 300px;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;min-width: 300px;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 5px;">' +
        '<img src="https://utility-apps-assets.certhis.io/certhisWallet/certhis_wallet.png" style="     max-height: 15px;margin-left: 20px;margin-top: 30px;">' +
        '<div id="closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
        '<div style="margin-top: 15px;margin-bottom: 40px;margin-top: 20px;"></div>'+
        '<div style="  padding-left: 20px;text-align: left;font-size: 23px;margin-bottom: 0px;">' +
        title +
        "</div>";

      if (message != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="    padding-left: 20px;margin-bottom: 60px;font-size: 15px;color: #7A7A7A;width: 82%;text-align: left;">' +
          message +
          "</div>";
      }

      if (content != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="padding: 20px;margin: auto;width: fit-content;font-size: 15px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 0px 3px #00000029;">' +
          '<div style="    background-image: url(https://utility-apps-assets.certhis.io/certhisWallet/sign.svg);height: 50px;width: 50px;margin: auto;background-size: 75% 87%;border-radius: 50%;margin-bottom: 10px;border: 1px solid #ccc;background-repeat: no-repeat;background-position: center center;"></div>'+
          '<div style="color: #7A7A7A;margin-bottom: 20px;">'+localStorage.getItem("WALLET_CERTHIS").replace(/(.{3}).*(.{3})/, "$1...$2")+'</div>'+
          content +
          "</div>";
      }

      if (get_tx != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="">' +
          '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;">'+
          '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 20px;">Recipient</div>'+
          '<div style="display: inline-block;width: 50%;text-align: right;padding-right: 15px;">' +
           get_tx.to.replace(/(.{3}).*(.{3})/, "$1...$2")+
          '</div></div>';

        if (get_tx.value != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;">'+
            '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 20px;">Value</div>'+
            '<div style="font-size: 20px;display: inline-block;width: 50%;text-align: right;padding-right: 15px;">' +
            web3.utils.fromWei(String(Number(get_tx.value))) +
            "</div></div>";
        } else {
          InsertHTMLBOX = InsertHTMLBOX + '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;"> '+
          '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 20px;">Value</div>'+
          '<div style="display: inline-block;width: 50%;text-align: right;padding-right: 15px;font-size: 20px;">0</div>'+
          '</div>';
        }

        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;">'+
          '<div style="font-size: 20px;display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 20px;">Gas Fee</div>'+
          '<div style="display: inline-block;width: 50%;text-align: right;padding-right: 15px;">' +
          web3.utils.fromWei(String(Number(get_tx.gas))) +
          "</div></div>" +
          "</div>";
          
          var confirm_button = '<button id="confirmPopupLib" style="    width: fit-content;font-size: 18px;cursor: pointer;margin-top: 10px;margin-bottom: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: 1px solid #848484;border-radius: 50px;color: #000;padding: 6px;padding-left: 25px;padding-right: 25px;">Confirm</button>';
     

      }
      else
      {
        var confirm_button = '<button id="confirmPopupLib" style="    width: fit-content;font-size: 18px;cursor: pointer;margin-top: 10px;margin-bottom: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: 1px solid #848484;border-radius: 50px;color: #000;padding: 6px;padding-left: 25px;padding-right: 25px;">Sign with <img src="https://utility-apps-assets.certhis.io/certhisWallet/certhis_icon.png" style="height: 20px;vertical-align: text-bottom;margin-left: 5px;"></button>';
      }

      InsertHTMLBOX =
        InsertHTMLBOX +
        '<div style="text-align:center;margin-top: 60px;margin-bottom: 25px;">' +
        '<button id="closePopupLib2" style="margin-right: 25px;width: fit-content;padding: 6px;padding-left: 25px;padding-right: 25px;font-size: 18px;cursor: pointer;border-radius: 50px;margin-top: 10px;margin-bottom: 10px;background: #fff;box-shadow: 0px 3px 6px #00000029;border: 0.5px solid #909090;color: #7A7A7A;">Close</button>' +
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
