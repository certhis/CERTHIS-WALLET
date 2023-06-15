module.exports = function (certhisWallet) {
  var storageC = require("./storageAdaptater");
  return {
    getDecryptedPrivate_key: async function () {
      const CryptoJS = require("crypto-js");
      return new Promise(async (resolve, reject) => {
        try {
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

          resolve(decrypted_private_key);
        } catch (e) {
          // statements
          var send_auth = await certhisWallet.auth(
            storageC.localStorageAdaptater.getItem("WALLET_EMAIL")
          );
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
          boxPopup.style.color = "#505050";
          boxPopup.style.background = "rgb(0 0 0 / 9%)";
          boxPopup.style["backdrop-filter"] = "blur(5px)";
          boxPopup.style["text-align"] = "center";
          boxPopup.style.display = "grid";

          var InsertHTMLBOX =
            '<div id="certhis-security-popup-content-certhis" style="font-family: Arial !important;position: relative;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;min-width: 365px;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 10px;">' +
            '<img src="https://utility-apps-assets.certhis.io/certhisWallet/cl2.png" style="     max-height: 35px;margin-left: 20px;margin-top: 30px;">' +
            '<div id="certhis-security-closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
            '<div style="margin-top: 15px;margin-top: 20px;"></div>' +
            '<div style="color:#505050;padding-left: 20px;text-align: left;font-size: 23px;    margin-bottom: 10px;">Security Verification</div>' +
            '<div style="    padding-left: 20px;margin-bottom: 40px;font-size: 15px;color: #7A7A7A;width: 82%;text-align: left;">You have received a code via email.<br>Please enter the code to continue your session.</div>' +
            '<div id="CerthisSecurityErrorMessageCerthisWalletAuthCode" style="margin-bottom: 20px;display:none;color:red;"></div>' +
            '<div style="margin-bottom: 30px;">' +
            '<input type="text"  id="certhis-security-certhis-code-1" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-2" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-3" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-4" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            '<input type="text"  id="certhis-security-certhis-code-5" style="width: 50px;    height: 50px;    margin-right: 3px;    display: inline-block;    border: none;    background: #F4F4F4;    border-radius: 5px;    text-align: center;    font-size: 21px;   color: #505050;" maxlength="1">' +
            "</div>" +
            '<div style="font-size: 13px;margin-bottom: 20px;#807979;">Didn\'t received the code? <span id="certhisSecurityResend" style="text-decoration: underline;cursor: pointer;display:block;background:linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;">Resend</span></div>' +
            '<button id="certhisSecurityConfirm" style="font-family: arial;width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border: none;    border-radius: 50px;    color: #fff;    padding: 5px;    padding-left: 35px;    padding-right: 35px;    background: linear-gradient(111.95deg, #121212 -18.15%, #72F6FE 113.57%);    border-radius: 59px;    margin: auto;margin-bottom: 20px;">Confirm</button>' +
            "</div>";

          boxPopup.innerHTML = InsertHTMLBOX;

          document.body.appendChild(boxPopup);
          let validBlock = false;

          var validCodeCerthisWallet = document.querySelector(
            "#certhisSecurityConfirm"
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

          var certhisSecurityResend = document.querySelector(
            "#certhisSecurityResend"
          );

          var certhisSecurityResendN = certhisSecurityResend.cloneNode(true);

          certhisSecurityResend.parentNode.replaceChild(
            certhisSecurityResendN,
            certhisSecurityResend
          );
          var blockResend = false;
          var checkcerthisSecurityResend =
            certhisSecurityResendN.addEventListener("click", async function () {
              if (blockResend == false) {
                blockResend = true;
                
                let time = 0;
                
                const interval = setInterval(() => {

                  var time_to_show = 220 - time;
                  certhisSecurityResendN.textContent =
                  `Code Sent. ( Wait ${time_to_show} Secondes for a new code )`;
                  time++;

                  certhisSecurityResendN.style['text-decoration'] = 'none';

                  if (time >= 220) {
                    clearInterval(interval);
                  }
                }, 1000);

                var send_auth = await certhisWallet.auth(
                  storageC.localStorageAdaptater.getItem("WALLET_EMAIL")
                );

                setTimeout(() => {
                  blockResend = false;
                  certhisSecurityResendN.style['text-decoration'] = 'underline';
                  certhisSecurityResendN.textContent = "Resend";
                }, 22000);
              }
            });

          var closePopup = document.querySelector(
            "#certhis-security-closePopupLib"
          );

          var closePopupN = closePopup.cloneNode(true);

          closePopup.parentNode.replaceChild(closePopupN, closePopup);
          var checkclosePopup = closePopupN.addEventListener(
            "click",
            function () {
              storageC.localStorageAdaptater.removeItem("CONNECTED");
              storageC.localStorageAdaptater.removeItem("walletconnect");
              storageC.localStorageAdaptater.removeItem("WALLET_CERTHIS");
              storageC.localStorageAdaptater.removeItem("WALLET_ECRYPTED_KEY");
              storageC.localStorageAdaptater.removeItem("RPC_CERTHIS");
              storageC.localStorageAdaptater.removeItem("RPC_ID_CERTHIS");
              storageC.localStorageAdaptater.removeItem("WALLET_TYPE");
              storageC.localStorageAdaptater.removeItem("WALLET_EMAIL");

              document.location.reload(true);
            }
          );

          for (let i = 1; i <= 5; i++) {
            var input = document.querySelector(
              `#certhis-security-certhis-code-${i}`
            );

            var inputN = input.cloneNode(true);
            input.parentNode.replaceChild(inputN, input);
            inputN.addEventListener("input", function (event) {
              var value = event.target.value;
              if (value.length === 1) {
                var nextInput = document.querySelector(
                  `#certhis-security-certhis-code-${
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
                `#certhis-security-certhis-code-${
                  Number(event.target.id.split("-")[4]) - 1
                }`
              );

              if (
                event.key === "Backspace" &&
                event.target.value.length === 0
              ) {
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
                    `#certhis-security-certhis-code-${j}`
                  ).value = paste[j - 1];
                }
                validCode();
              }
            });
          }

          async function validCode() {
            var ErrorMessageCerthisWalletAuthCode = document.querySelector(
              "#CerthisSecurityErrorMessageCerthisWalletAuthCode"
            );

            let code = "";
            for (let i = 1; i <= 5; i++) {
              var input = document.querySelector(
                `#certhis-security-certhis-code-${i}`
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

                if (validCode.encrypted_key != undefined) {
                  storageC.localStorageAdaptater.setItem(
                    "WALLET_ECRYPTED_KEY",
                    validCode.encrypted_key
                  );

                  //code good
                  boxPopup.remove();
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

                  resolve(decrypted_private_key);
                } else {
                  ErrorMessageCerthisWalletAuthCode.textContent =
                    "Invalid Code";
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
        }
      });
    },
  };
};
