module.exports = function (certhisWallet) {
  return {
    getDecryptedPrivate_key: async function () {
      const CryptoJS = require("crypto-js");
      return new Promise(async (resolve, reject) => {
        try {
          var private_key = await certhisWallet.check2(
            localStorage.getItem("WALLET_CERTHIS"),
            localStorage.getItem("WALLET_ECRYPTED_KEY")
          );
          var decrypted_private_key = CryptoJS.AES.decrypt(
            private_key.data.encrypted_private_key,
            localStorage.getItem("WALLET_ECRYPTED_KEY")
          ).toString(CryptoJS.enc.Utf8);

          localStorage.setItem("WALLET_ECRYPTED_KEY",private_key.data.next_key)
          //store new encrypted key

          resolve(decrypted_private_key);
        } catch (e) {
          // statements

          var boxPopup = document.getElementById("boxPopupCerthisRetry");
          const rpcinfo = require("./rpc");
          if (boxPopup) {
            boxPopup.remove();
          }
          boxPopup = document.createElement("div");
          boxPopup.id = "boxPopupCerthisRetry";
          boxPopup.style.position = "fixed";
          boxPopup.style.width = "100%";
          boxPopup.style["z-index"] = "100";
          boxPopup.style.height = "100%";
          boxPopup.style.top = 0;
          boxPopup.style.background = "#ffffffa3";
          boxPopup.style["text-align"] = "center";
          boxPopup.style.display = "grid";

          var InsertHTMLBOX =
            '<div id="popup-content-certhis" style="font-family: Arial !important;position: relative;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;min-width: 300px;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 5px;">' +
            '<img src="https://utility-apps-assets.certhis.io/certhisWallet/certhis_wallet.png" style="     max-height: 15px;margin-left: 20px;margin-top: 30px;">' +
            '<div id="closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
            '<div style="margin-top: 15px;margin-bottom: 40px;margin-top: 20px;"></div>' +
            '<div style="  padding-left: 20px;text-align: left;font-size: 23px;margin-bottom: 0px;">SECURITY POPUP</div>' +
            '<div style="    padding-left: 20px;margin-bottom: 60px;font-size: 15px;color: #7A7A7A;width: 82%;text-align: left;">You have received a code via email.<br>Please enter the code to continue your session</div>'+
            '<input type="text"  id="certhis-security-certhis-code-1" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-2" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-3" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-4" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-5" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
            "</div>";

          boxPopup.innerHTML = InsertHTMLBOX;

          document.body.appendChild(boxPopup);
        }
      });
    },
  };
};
