module.exports = function (web3) {
  var storageC = require("./storageAdaptater");

  var show_popup = function (
    title = null,
    message = null,
    content = null,
    tx = null
  ) {


    var is_mobile = false;

    //detect with screen size < 972
    if (window.innerWidth <= 550) {
      is_mobile = true;
    }

    function escapeHTML(text) {
      var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };

      return text.replace(/[&<>"']/g, function (m) {
        return map[m];
      });
    }

    return new Promise(async (resolve, reject) => {
      var get_tx = tx;
      var boxPopup = document.getElementById("boxPopupCerthis");
      const rpcinfo = await require("./rpc").init();
      if (boxPopup) {
        boxPopup.remove();
      }
      boxPopup = document.createElement("div");
      boxPopup.id = "boxPopupCerthis";
      boxPopup.style.position = "fixed";
      boxPopup.style.width = "100%";
      boxPopup.style["z-index"] = "1000";
      boxPopup.style.height = "100%";
      boxPopup.style.top = 0;
      boxPopup.style.background = "rgb(0 0 0 / 9%)";
      boxPopup.style["backdrop-filter"] = "blur(5px)";
      boxPopup.style["text-align"] = "center";
      boxPopup.style.display = "grid";


      var add_style = '';

      if (is_mobile) {

        add_style = "margin-bottom:-500px;position:fixed;   border-radius: 30px 30px 0px 0px;"

      }
      var InsertHTMLBOX =
        `<div id="popup-content-certhis"  style="color: #505050;
        font-family: Arial !important;
        position: relative;
        min-height: 300px;
        display: grid;
        align-content: center;
        margin: auto;
        max-width: 95%;
        width: 400px;
        box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);
        border-radius: 28px;
        animation: smooth-appear 1s ease forwards;
        opacity: 0;max-width: 100%;
        background: #FFF;${add_style}">` +
        `<div style="    border-radius: 22px 22px 0px 0px;
        background: radial-gradient(44.42% 44.42% at 50% 50%, rgba(18, 18, 18, 0.76) 0%, #121212 100%), #FFF;"><div style="width: 100%;
      display: flex;
      align-items: center;
      margin-top: 22px;
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      color: #fff;
      justify-content: center;
      gap: 44px; 
  "><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/certhis_icon.png" style="  width: 38.772px;
  height: 41.772px;" ><div><div style="background: radial-gradient(1465.66% 602.63% at 21.26% 58%, #72F6FE 0%, #121212 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;    display: inline-block;">Sign With</div> your wallet</div><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/certhis_icon.png" style="   width: 38.772px;
  height: 41.772px;opacity:0;" ></div>` +
        `<div id="closePopupLib" style="    position: absolute;
        width: fit-content;
        right: 15px;
        cursor: pointer;
        top: 19px;
        width: 25.779px;
        height: 25.779px;z-index:15;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/certhis_close.png" style="width: 25px;
        height: 25px;"></div>` +
        '<div style="margin-bottom: 28px;margin-top: 0px;"></div>' +
        `<div style="    margin-bottom: 16px;
        color: #FFF;
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;">` +
        title +
        "</div>";

      if (message != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          `<div style="border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.50);
          color: #FFF;
          font-size: 12px;
          margin: auto;
          display: flex;
          font-style: normal;
          transition: opacity 0.5s ease 0s, visibility 0.5s ease 0s;
          gap: 10px;
          padding-left: 14px;
          padding-top: 11px;
          max-width: 90%;
          width: 295px;
          font-weight: 500;
          line-height: normal;
          height: 51px;
          margin-bottom: 16px;
          align-items: flex-start;
          justify-content: flex-start;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/v2/check_p_w.png"style="width: 13px;height: 13px;  " ><div style="  text-align: left;">` +
          escapeHTML(message) +
          "</div></div>";
      }

      InsertHTMLBOX = InsertHTMLBOX + `</div><div style="    padding: 21px 48px;
      width: 100%;">`;
      if (content != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          `` +
          `<div style="margin-bottom: 20px;
          display: flex;
          border-radius: 8px;
          background: #F3F3F3;
          color: #121212;
          text-align: center;
          font-size: 13px;
          font-style: normal;
          width: 192px;
          height: 49px;
          font-weight: 800;
          line-height: normal;
          padding-right: 42px;
          padding-left: 16px;
          align-items: center;
          gap: 17px;"><div>Address</div><div style="color: rgba(97, 97, 97, 0.80);font-size: 12px; font-style: normal; font-weight: 500; line-height: normal; text-decoration-line: underline;">` +
          storageC.localStorageAdaptater
            .getItem("WALLET_CERTHIS")
            .replace(/(.{3}).*(.{3})/, "$1...$2") +
          `</div></div><div style="    display: flex;
          border-radius: 8px;
          background: #F3F3F3;
          width: 295px;
          max-width: 95%;
          overflow: hidden;
          padding: 15px;
          height: 169px;
          flex-direction: column;
          align-items: flex-start;"><div style="color: #121212; font-size: 13px; font-style: normal; font-weight: 800; line-height: normal;">Message</div><div style="max-width: 100%;
          word-wrap: break-word;
          text-align: left;
          margin-top: 14px;
          color: rgba(97, 97, 97, 0.80);
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          height: 96px;
          max-height: 96px;
          overflow-y: auto;">` +
          content +
          "</div></div>";
      }

      if (get_tx != null) {
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="    border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;display: flex;">' +
          '<div style="vertical-align: top;display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Recipient</div>' +
          '<div style="font-size: 16px;display: inline-block;width: 50%;text-align: right;padding-right: 15px;"><a href="' +
          rpcinfo.ether_scan_array[
            storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
          ] +
          "address/" +
          get_tx.to +
          '" target="_blank" style="    display: block;color: #579ED5A8;text-decoration: underline;">' +
          get_tx.to.replace(/(.{3}).*(.{3})/, "$1...$2") +
          "</a>" +
          "</div></div>";

        if (get_tx.value != undefined) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="   display: flex; border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;">' +
            '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Value</div>' +
            '<div style="font-size: 16px;display: inline-block;width: 50%;text-align: right;padding-right: 15px;">' +
            web3.utils.fromWei(String(BigInt(get_tx.value))) +
            " " +
            rpcinfo.currency_array[
              storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
            ] +
            "</div></div>";
        } else {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style=" display: flex;   border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;"> ' +
            '<div style="display: inline-block;width: 50%;text-align: left;padding-left: 15px;font-size: 16px;">Value</div>' +
            '<div style="display: inline-block;width: 50%;font-size: 16px;text-align: right;padding-right: 15px;font-size: 16px;">0 ' +
            rpcinfo.currency_array[
              storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
            ] +
            "</div>" +
            "</div>";
        }

        var gas_price = web3.utils.toWei(String(BigInt(tx.gas)), "wei");
        var gasPriceInWei = web3.utils.toWei(
          String(BigInt(tx.gasPrice)),
          "wei"
        );
        var totalFeeInWei = gas_price * gasPriceInWei;
        var gas_price = web3.utils.fromWei(String(totalFeeInWei), "ether");
        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="  display: flex;  border-bottom: 2px solid #ccc;padding-bottom: 10px;margin-bottom: 15px;display: flex;">' +
          '<div style="    display: inline-block;width: fit-content;text-align: left;padding-left: 15px;padding-right: 15px;margin-right: auto;font-size: 16px;">Gas Fee</div>' +
          '<div style="    display: inline-block;width: fit-content;text-align: right;font-size: 16px;padding-right: 15px;">' +
          gas_price +
          " " +
          rpcinfo.currency_array[
            storageC.localStorageAdaptater.getItem("RPC_ID_CERTHIS")
          ] +
          "</div></div>";

        var confirm_button =
          '<button id="confirmPopupLib" style="font-family: arial; cursor: pointer; border-radius: 8.249px; border: 1.031px solid #FFF; background: #121212; color: #FFF; width: 100%; font-size: 15px; font-style: normal; font-weight: 800; margin-top: 21px; line-height: 24.748px; margin-bottom: 25px; box-shadow: 0px 1.03117px 2.06234px 0px rgba(16, 24, 40, 0.05); height: 49px;">Click To Confirm</button>';
      } else {
        var confirm_button =
          '<button id="confirmPopupLib" style="font-family: arial; cursor: pointer; border-radius: 8.249px; border: 1.031px solid #FFF; background: #121212; color: #FFF; width: 100%; font-size: 15px; font-style: normal; font-weight: 800; margin-top: 21px; line-height: 24.748px; margin-bottom: 25px; box-shadow: 0px 1.03117px 2.06234px 0px rgba(16, 24, 40, 0.05); height: 49px;">Click to Sign</button>';
      }

      InsertHTMLBOX =
        InsertHTMLBOX +
        confirm_button +
   
        "</div></div>";

      boxPopup.innerHTML = InsertHTMLBOX;

      document.body.prepend(boxPopup);

      let closePopup = document.querySelector("#closePopupLib");
      var closePopupN = closePopup.cloneNode(true);
      closePopup.parentNode.replaceChild(closePopupN, closePopup);

      closePopupN.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(false);
      });

      // let closePopup2 = document.querySelector("#closePopupLib2");
      // var closePopup2N = closePopup2.cloneNode(true);
      // closePopup2.parentNode.replaceChild(closePopup2N, closePopup2);

      // closePopup2N.addEventListener("click", function () {
      //   boxPopup.style.display = "none";
      //   resolve(false);
      // });

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
        "Your signature verifies that you’re the owner of this address",
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
