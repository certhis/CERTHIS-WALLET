"use strict";

/**
 * @module certhis-wallet
 */

module.exports = function (Web3, CoinbaseWalletSDK, WalletConnectProvider) {
    const providerLib = require("./provider");
    const InjectCoinbase = CoinbaseWalletSDK;
    const InjectWalletConnect = WalletConnectProvider;
    var axios = require("axios");
    var request = require("./request")(axios, "https://wallet-api.certhis.io/");
    const certhisWallet = require("./certhisWallet")(request);
    const providerFunction = providerLib(certhisWallet, Web3, request);
    const CryptoJS = require("crypto-js");
    const rpcinfo = require("./rpc");
    var rpc_array = rpcinfo.rpc_array;
    return {
        walletInfos: async function () {
            const rpcinfo = require("./rpc");
            let web3Temp = new Web3(
                new Web3.providers.HttpProvider(
                    rpcinfo.rpc_array[localStorage.getItem("RPC_ID_CERTHIS")]
                )
            );
            var balance = await web3Temp.eth.getBalance(
                localStorage.getItem("WALLET_CERTHIS")
            );
            balance = web3Temp.utils.fromWei(String(balance));

            var boxWallet = document.getElementById("boxWalletCerthis");

            if (boxWallet) {
                boxWallet.remove();
            }
            boxWallet = document.createElement("div");
            boxWallet.id = "boxWalletCerthis";
            boxWallet.style.position = "fixed";
            boxWallet.style.width = "100%";
            boxWallet.style["z-index"] = "100";
            boxWallet.style.height = "100%";
            boxWallet.style.top = 0;
            
            boxWallet.style.background = "rgb(0 0 0 / 9%)";
            boxWallet.style["backdrop-filter"] = "blur(5px)";
            boxWallet.style["text-align"] = "center";
            boxWallet.style.display = "grid";

            var InsertHTMLBOX =
                '<div id="certhis-wallet-popup-content-certhis" style="font-family: Arial !important;    position: relative;    min-height: 300px;    display: grid;    align-content: center;    box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;    margin: auto;    max-width: 95%;    background: #fff;    width: 400px;    border-radius: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;    box-shadow: 0px 3px 6px #00000029;    border-radius: 5px;    border-radius: 10px;    box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);">' +
                '<img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/certhis_wallet.png" style="     max-height: 40px;margin-left: 20px;margin-top: 30px;">' +
                '<div id="certhis-security-closePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
                '<div style="margin-top: 15px;margin-bottom: 10px;margin-top: 20px;"></div>' +
                '<div id="step1-wallet-certhis-show" style="text-align:center;padding:25px;">' +
                '<div style="text-align: center;font-size: 23px;    margin-bottom: 10px;">Your Wallet Address</div>' +
                '<div style="color:#7A7A7A">' +
                localStorage.getItem("WALLET_CERTHIS") +
                "</div>" +
                '<div style="margin-top: 50px;margin-bottom: 30px; font-size: 20px;"><div style="   display: inline-block;width: 50%;text-align: left;">Network</div><div style="display: inline-block;width: 50%;text-align: right;">' +
                rpcinfo.name_network[localStorage.getItem("RPC_ID_CERTHIS")] +
                "</div></div>" +
                '<div style="    font-size: 20px;"><div style="display: inline-block;width: 50%;text-align:left;">Balance</div><div style="display: inline-block;width: 50%;text-align: right;">' +
                balance +
                " " +
                rpcinfo.currency_array[localStorage.getItem("RPC_ID_CERTHIS")] +
                "</div></div>" +
                '<div id="exportbutton-certhis-wallet" style="cursor: pointer;margin-top: 70px;text-decoration: underline;font-weight: bold;">Export my Private Key</div>' +
                "</div>" +
                '<div id="step-agree-certhis-wallet" style="display:none;padding:25px;">' +
                '<div style="text-align: center;font-size: 23px;    margin-bottom: 10px;">Export my Private Key</div>' +
                '<div style="color:#7A7A7A">By exporting  the private key for :<br>' +
                localStorage.getItem("WALLET_CERTHIS") +
                "<br>You agreeing that : </div>" +
                '<div style="max-width: 300px;margin: auto;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-1"> As a user of Certhis\' services, you acknowledge that you have read and agreed to the terms outlined in the company\'s Terms of Service, including the risks associated with owning your own private key.</div>' +
                '<div style="max-width: 300px;margin: auto;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-2"> It is your responsibility to properly manage and secure this key, as well as any assets associated with it. Certhis cannot assist you in recovering, accessing, or storing your raw private key.</div>' +
                '<div style="max-width: 300px;margin: auto;text-align: justify;font-size: 13px;margin-top: 20px;margin-bottom: 20px;"><input type="checkbox" id="checkbox-certhis-wallet-3"> Certhis cannot provide customer support for any third-party wallet software you may use in conjunction with your private key, and does not guarantee compatibility or protection for these products.</div>' +
                '<button disabled="true" id="confirmExportCerthisWallet" style="opacity:0.3;width: fit-content;font-size: 18px;cursor: pointer;margin-top: 10px;margin-bottom: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: 1px solid #848484;border-radius: 50px;color: #000;padding: 6px;padding-left: 25px;padding-right: 25px;">Export</button>' +
                "</div>" +
                '<div id="step-code-certhis-wallet"  style="display:none;">' +
                '<div style="  padding-left: 20px;text-align: left;font-size: 23px;    margin-bottom: 10px;">Security Verification</div>' +
                '<div style="    padding-left: 20px;margin-bottom: 40px;font-size: 15px;color: #7A7A7A;text-align: left;">You have received a code via email.<br>Please enter the code to continue.</div>' +
                '<div id="CerthisSecurityErrorMessageCerthisWalletAuthCode" style="display:none;color:red;"></div>' +
                '<div style="padding:25px;">' +
                '<input type="text"  id="certhis-wallet-certhis-code-1" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
                '<input type="text"  id="certhis-wallet-certhis-code-2" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
                '<input type="text"  id="certhis-wallet-certhis-code-3" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
                '<input type="text"  id="certhis-wallet-certhis-code-4" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
                '<input type="text"  id="certhis-wallet-certhis-code-5" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
                "</div>" +
                '<div style="font-size: 13px;margin-bottom: 20px;">Didn\'t recived the code? <span id="certhiswalletSecurityResend" style="color: #579ED5A8;text-decoration: underline;cursor: pointer;display:block">Resend</span></div>' +
                '<button id="certhiswalletConfirm" style="background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 0px 14px #00000029;border: 1px solid #C9C9C9;font-size: 20px;padding: 5px;margin-top: 20px;padding-right: 25px;padding-left: 25px;border-radius: 26px;margin-bottom: 30px;width: 200px;margin: auto;margin-bottom: 40px;margin-top: 20px;">Confirm</button>' +
                "</div>" +
                '<div id="step-private-certhis-wallet"  style=" padding: 25px;display:none;">' +
                '<div style=" text-align: center;font-size: 23px;    margin-bottom: 10px;">Reveal Private Key</div>' +
                '<div style="margin-bottom: 40px;margin-top: 40px;font-size: 15px;color: red;text-align: center;">Attention! Make sure to keep it safe and secure.<br>Do not share it with anyone.</div>' +
                '<textarea readonly id="private-key-export-certhis" style="    background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: navajowhite;width: 100%;height: 100px;margin-bottom: 35px;color: #129E9E;margin-top: 0px;font-size: 17px;padding: 10px;letter-spacing: 1px;"></textarea>';
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

            let checkbox1 = document.querySelector(
                "#checkbox-certhis-wallet-1"
            );
            var checkbox1N = checkbox1.cloneNode(true);
            checkbox1.parentNode.replaceChild(checkbox1N, checkbox1);

            let checkbox2 = document.querySelector(
                "#checkbox-certhis-wallet-2"
            );
            var checkbox2N = checkbox2.cloneNode(true);
            checkbox2.parentNode.replaceChild(checkbox2N, checkbox2);

            let checkbox3 = document.querySelector(
                "#checkbox-certhis-wallet-3"
            );
            var checkbox3N = checkbox3.cloneNode(true);
            checkbox3.parentNode.replaceChild(checkbox3N, checkbox3);

            let button = document.querySelector("#confirmExportCerthisWallet");
            var buttonN = button.cloneNode(true);
            button.parentNode.replaceChild(buttonN, button);

            let textarea = document.querySelector(
                "#private-key-export-certhis"
            );
            var textareaN = textarea.cloneNode(true);
            textarea.parentNode.replaceChild(textareaN, textarea);

            function checkCheckboxes() {
                if (
                    checkbox1N.checked &&
                    checkbox2N.checked &&
                    checkbox3N.checked
                ) {
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
                    localStorage.getItem("WALLET_EMAIL")
                );

                step1N.style.display = "none";
                step2N.style.display = "none";
                step3N.style.display = "block";

                return false;
            });

            let exportWallet = document.querySelector(
                "#exportbutton-certhis-wallet"
            );
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

            var validCodeCerthisWalletN =
                validCodeCerthisWallet.cloneNode(true);

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

                                certhiswalletSecurityResendN.style[
                                    "text-decoration"
                                ] = "none";

                                if (time >= 220) {
                                    clearInterval(interval);
                                }
                            }, 1000);

                            var send_auth = await certhisWallet.auth(
                                localStorage.getItem("WALLET_EMAIL")
                            );

                            setTimeout(() => {
                                blockResend = false;
                                certhiswalletSecurityResendN.style[
                                    "text-decoration"
                                ] = "underline";
                                certhiswalletSecurityResendN.textContent =
                                    "Resend";
                            }, 22000);
                        }
                    }
                );

            for (let i = 1; i <= 5; i++) {
                var input = document.querySelector(
                    `#certhis-wallet-certhis-code-${i}`
                );

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
                        ErrorMessageCerthisWalletAuthCode.style.display =
                            "None";

                        var validCode = await certhisWallet.check(
                            localStorage.getItem("WALLET_CERTHIS"),
                            code
                        );

                        validCode = validCode.data;

                        if (validCode.encrypted_key != undefined) {
                            localStorage.setItem(
                                "WALLET_ECRYPTED_KEY",
                                validCode.encrypted_key
                            );
                            var private_key = await certhisWallet.check2(
                                localStorage.getItem("WALLET_CERTHIS"),
                                localStorage.getItem("WALLET_ECRYPTED_KEY")
                            );
                            var decrypted_private_key = CryptoJS.AES.decrypt(
                                private_key.data.encrypted_private_key,
                                localStorage.getItem("WALLET_ECRYPTED_KEY")
                            ).toString(CryptoJS.enc.Utf8);

                            localStorage.setItem(
                                "WALLET_ECRYPTED_KEY",
                                private_key.data.next_key
                            );

                            //store new encrypted key

                            textareaN.value = decrypted_private_key;

                            step3N.style.display = "none";
                            step4N.style.display = "block";
                        } else {
                            ErrorMessageCerthisWalletAuthCode.textContent =
                                "Invalid Code";
                            ErrorMessageCerthisWalletAuthCode.style.display =
                                "block";
                            validBlock = false;
                            //error code
                        }
                    } else {
                        ErrorMessageCerthisWalletAuthCode.textContent =
                            "Invalid Code Format";
                        ErrorMessageCerthisWalletAuthCode.style.display =
                            "block";
                        validBlock = false;
                        //error code
                    }
                }
            }
        },
        addFundPopup: async function (
            functionGasFees,
            address,
            value = 0,
            chain_id
        ) {
            var boxPopupAddFund = document.getElementById(
                "boxPopupAddFundCerthis"
            );
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
                balance = web3Temp.utils.fromWei(String(balance));
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
                var gas_price = web3Temp.utils.fromWei(
                    String(totalFeeInWei),
                    "ether"
                );
                console.log(value);
                if (value != 0) {
                    value = web3Temp.utils.fromWei(String(value), "ether");
                }
                var amount_missing = Number(value) + Number(gas_price);
                console.log(amount_missing);
                console.log(balance);
                if (balance >= amount_missing) {
                    resolve(true);
                } else {
                    amount_missing = Number(amount_missing) - Number(balance);

                    var boxPopupAddFund = document.getElementById(
                        "addFundboxPopupCerthis"
                    );

                    if (boxPopupAddFund) {
                        boxPopupAddFund.remove();
                    }

                    var boxPopupAddFund = document.createElement("div");

                    boxPopupAddFund.id = "addFundboxPopupCerthis";
                    boxPopupAddFund.style.position = "fixed";
                    boxPopupAddFund.style.width = "100%";
                    boxPopupAddFund.style["z-index"] = "100";
                    boxPopupAddFund.style.height = "100%";
                    boxPopupAddFund.style.top = 0;
                    boxPopupAddFund.style.background = "#ffffffa3";
                    boxPopupAddFund.style["text-align"] = "center";
                    boxPopupAddFund.style.display = "grid";

                    var InsertHTMLBOX =
                        '<div id="popup-add-fund-content-certhis" style="font-family: Arial !important;position: relative;min-height: 300px;display: grid;align-content: center;box-shadow: rgb(50 50 93 / 25%) 0px 13px 27px -5px, rgb(0 0 0 / 30%) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;min-width: 300px;border-radius: 10px;background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 5px;">' +
                        '<img src="https://utility-apps-assets.certhis.io/certhisWallet/certhisLogo.png" style="max-height: 55px;width:auto;margin-left: 20px;margin-top: 10px;">' +
                        '<div id="addfundclosePopupLib" style="    position: absolute;width: fit-content;right: 26px;cursor: pointer;top: 15px;font-size: 17px;color: #7a7a7a;font-family: system-ui;">X</div>' +
                        '<div id="first_step_add_fund_certhis" style="padding:25px"><div style="margin-top: 25px;padding-left: 20px;text-align: center;font-size: 23px;margin-bottom: 0px;">Insufficient Funds to Send Transaction</div>' +
                        '<div style="color: #707070;font-size: 17px;text-align: center;">You need additional credits in your wallet to pay the transaction.</div>' +
                        '<div style="    margin-top: 60px;margin-bottom: 60px;"><div style="display: inline-block;width: 35%;text-align: left;font-size: 1em;">Amount Missing</div> <div style="    font-weight: bolder;font-size: 1.3em;display: inline-block;width: 63%;text-align: right;">' +
                        String(amount_missing) +
                        " " +
                        rpcinfo.currency_array[chain_id] +
                        "</div></div>" +
                        '<div style="font-weight: bolder;font-size: 17px;margin-bottom: 25px;">Transfert funds to your Wallet</div>' +
                        '<input type="text" readonly style="background: #FFFFFF 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border: 2px solid #7A7A7A;border-radius: 8px;font-size: 16px;height: 42px;width: 100%;text-align: center;margin-bottom: 35px;" value="' +
                        address +
                        '">';

                    InsertHTMLBOX =
                        InsertHTMLBOX +
                        '<div style="font-weight: bolder;font-size: 17px;margin-bottom: 25px;">Or</div>';

             
                        if (rpcinfo.rpc_type[chain_id] == "mainnet" && localStorage.getItem("BETA_ENABLE") != 1) {
                            InsertHTMLBOX =
                                InsertHTMLBOX +
                                '<div id="showBoxTransacCerthisWallet" style="text-decoration: underline;cursor:pointer">Add funds via Credit Card</div>';
                        } else if (rpcinfo.rpc_type[chain_id] == "mainnet" && localStorage.getItem("BETA_ENABLE") == 1){

                             InsertHTMLBOX =
                                InsertHTMLBOX +
                                '<a href="https://pay.sendwyre.com/purchase?&destCurrency=' +rpcinfo.currency_array[chain_id] + '&dest=' +address+' "style="text-decoration: underline;cursor:pointer" target="_blank">Add funds via Credit Card</a>';
                        }
                        else {
                            InsertHTMLBOX =
                                InsertHTMLBOX +
                                '<a style="text-decoration: underline;cursor: pointer;color:#000" target="_blank" href="' +
                                rpcinfo.rpc_faucet[chain_id] +
                                '">Add funds via Faucet (FREE)</a>';
                        }
                
                    InsertHTMLBOX =
                        InsertHTMLBOX +
                        "</div>" +
                        '<div id="transakFrame" style="display:none"><iframe height="625" title="Transak On/Off Ramp Widget"' +
                        'src="https://global-stg.transak.com?apiKey=ba9499fc-c5bf-4c39-9621-5fd53634231b&defaultCryptoAmount=' +
                        String(amount_missing) +
                        "&walletAddress=" +
                        address +
                        "&cryptoCurrencyCode=" +
                        rpcinfo.currency_array[chain_id] +
                        '"' +
                        'frameborder="no" allowtransparency="true" allowfullscreen=""' +
                        'style="    display: block;max-width: 97%;width:500px;margin: auto;height: 600px;max-height: 625px;margin-bottom: 10px;">' +
                        "</iframe></div>" +
                        "</div>";

                    boxPopupAddFund.innerHTML = InsertHTMLBOX;

                    document.body.appendChild(boxPopupAddFund);

                    let first_step_add_fund_certhis = document.querySelector(
                        "#first_step_add_fund_certhis"
                    );
                    var first_step_add_fund_certhisN =
                        first_step_add_fund_certhis.cloneNode(true);
                    first_step_add_fund_certhis.parentNode.replaceChild(
                        first_step_add_fund_certhisN,
                        first_step_add_fund_certhis
                    );

                    let transakFrame = document.querySelector("#transakFrame");
                    var transakFrameN = transakFrame.cloneNode(true);
                    transakFrame.parentNode.replaceChild(
                        transakFrameN,
                        transakFrame
                    );

                    var start_interval;
                    start_interval = setInterval(async function () {
                        var balanceN = await web3Temp.eth.getBalance(address);
                        balanceN = web3Temp.utils.fromWei(String(balanceN));
                        var amount_missingN = Number(value) + Number(gas_price);

                        if (Number(balanceN) >= amount_missingN) {
                            boxPopupAddFund.style.display = "none";
                            resolve(true);
                            clearInterval(start_interval);
                        }
                    }, 5000);

                    let closePopup = document.querySelector(
                        "#addfundclosePopupLib"
                    );
                    var closePopupN = closePopup.cloneNode(true);
                    closePopup.parentNode.replaceChild(closePopupN, closePopup);

                    closePopupN.addEventListener("click", function () {
                        boxPopupAddFund.style.display = "none";
                        clearInterval(start_interval);
                        resolve(false);
                    });

                    if (rpcinfo.rpc_type[chain_id] == "mainnet") {
                        let showBoxTransacCerthisWallet =
                            document.querySelector(
                                "#showBoxTransacCerthisWallet"
                            );
                        var showBoxTransacCerthisWalletN =
                            showBoxTransacCerthisWallet.cloneNode(true);
                        showBoxTransacCerthisWallet.parentNode.replaceChild(
                            showBoxTransacCerthisWalletN,
                            showBoxTransacCerthisWallet
                        );

                        showBoxTransacCerthisWalletN.addEventListener(
                            "click",
                            function () {
                                first_step_add_fund_certhisN.style.display =
                                    "none";
                                transakFrameN.style.display = "block";
                            }
                        );
                    }
                }
            });
        },
        disconnect: async function () {
            return new Promise(async (resolve, reject) => {
                localStorage.removeItem("CONNECTED");
                localStorage.removeItem("walletconnect");
                localStorage.removeItem("WALLET_CERTHIS");
                localStorage.removeItem("WALLET_ECRYPTED_KEY");
                localStorage.removeItem("RPC_CERTHIS");
                localStorage.removeItem("RPC_ID_CERTHIS");
                localStorage.removeItem("WALLET_TYPE");
                localStorage.removeItem("WALLET_EMAIL");
                resolve(null);
            });
        },
        run: async function (
            rpc_id,
            rpc,
            id_insert = "popupCerthis",
            custom_prefix = "",
            return_provider = null,
            disable_certhis_wallet = null
        ) {
            return new Promise(async (resolve, reject) => {
                //disable certhis wallet engine
                var display_none_certhis_wallet = "";
                var text_wallet_connect_with = "Or";

                if(localStorage.getItem("BETA_ENABLE") != 3)
                {


                localStorage.setItem("BETA_ENABLE", 0);
                if (disable_certhis_wallet != null) {
                    display_none_certhis_wallet = "display:none;";
                    text_wallet_connect_with = "Connect With";
                    localStorage.setItem("BETA_ENABLE", 1);
                }

                }

                if (
                    localStorage.getItem("RPC_CERTHIS") != undefined &&
                    localStorage.getItem("RPC_CERTHIS") != ""
                ) {
                    var rpcUrl = localStorage.getItem("RPC_CERTHIS");
                } else {
                    var rpcUrl = rpc;
                    localStorage.setItem("RPC_CERTHIS", rpc);
                }

                if (
                    localStorage.getItem("RPC_ID_CERTHIS") != undefined &&
                    localStorage.getItem("RPC_ID_CERTHIS") != ""
                ) {
                    var rpcId = localStorage.getItem("RPC_ID_CERTHIS");
                } else {
                    var rpcId = rpc_id;
                    localStorage.setItem("RPC_ID_CERTHIS", rpc_id);
                }

                var boxCerthis = document.getElementById(id_insert);

                if (localStorage.getItem("CONNECTED") == "true") {
                    if (localStorage.getItem("WALLET_TYPE") == "METAMASK") {
                        const accounts = await window.ethereum.enable();
                        resolve(window.ethereum);
                    } else if (
                        localStorage.getItem("WALLET_TYPE") == "COINBASE"
                    ) {
                        var LoadCoinbase = new InjectCoinbase({
                            appName: "Certhis Wallet",
                            appLogoUrl:
                                "https://certhis.io/assets/images/logo.png",
                            darkMode: false,
                            overrideIsMetaMask: false,
                        });

                        var provider = LoadCoinbase.makeWeb3Provider(
                            rpcUrl,
                            rpcId
                        );
                        await provider.send("eth_requestAccounts");

                        resolve(provider);
                    } else if (
                        localStorage.getItem("WALLET_TYPE") == "WALLETCONNECT"
                    ) {
                        var provider = new InjectWalletConnect({
                            infuraId: "56e93ff3382e494782c4d6e2d8d1c902", // Required
                        });
                        await provider.enable();

                        resolve(provider);
                    } else {
                        var getProvider = await providerFunction.getProvider(
                            rpcUrl,
                            localStorage.getItem("WALLET_CERTHIS"),
                            localStorage.getItem("WALLET_ECRYPTED_KEY")
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
                        boxCerthis.style["z-index"] = "100";
                        boxCerthis.style["font-family"] = "arial";
                    }

                    boxCerthis.classList.add("certhisWalletStyle");
                    boxCerthis.id = id_insert;

                    var InsertHTMLBOX = "";

                    if (id_insert == "popupCerthis") {
                        InsertHTMLBOX =
                            '<div id="' +
                            id_insert +
                            '-box-content-certhis" style="width: auto;    position: relative;    padding: 23px;    min-height: 300px;    display: grid;    align-content: center;    margin: auto;    max-width: 95%;    background: #fff;    border-radius: 10px;    box-shadow: 0px 0px 12px rgb(0 0 0 / 15%), 0px 4px 12px rgb(0 0 0 / 15%);">' +
                            '<div id="' +
                            id_insert +
                            '-closePopup" style="position: absolute;width: fit-content;right: 15px;cursor: pointer;top: 15px;">X</div>';
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
                        '<img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/certhis_wallet.png" style="max-height: 50px;margin-top: 25px;" >' +
                        '<div style="font-size:25px;text-align: center;font-size: 20px;margin-top: 30px;text-align: center;color: #505050;" >Don\'t have a wallet Yet ?</div>' +
                        '<div  style="font-size: 14px;    margin-bottom: 25px;color: #807979;font-weight: 300;    margin-top: 10px;">Use your email directly and start navigating<br>on Web3 instantly.</div>' +
                        '<div id="' +
                        id_insert +
                        '-ErrorMessageCerthisWallet" style="display:none;color:red;"></div>' +
                        '<div style="    position: relative;width: fit-content;margin: auto;"><input type="email"  id="' +
                        id_insert +
                        '-certhisWalletEmail" placeholder="Your email" style="margin-top: 40px;    display: block;    margin: auto;    margin-bottom: 20px;    background: #FFFFFF 0% 0% no-repeat padding-box;    border-radius: 26px;    border: 0;    padding: 13px;    padding-left: 20px;    padding-right: 20px;    background: #F8F8F8;    border-radius: 8px;    font-weight: 300;    font-size: 15px;    padding-right: 118px;">' +
                        '<button id="' +
                        id_insert +
                        '-connectCerthis" style="background: #FFFFFF 0% 0% no-repeat padding-box; box-shadow: 0px 0px 14px #00000029; border: none; font-size: 14px; padding: 5px; margin-top: 20px; padding-right: 25px; padding-left: 25px; border-radius: 26px; margin-bottom: 30px; position: absolute; color: #fff; font-weight: 300; top: -11px; right: 12px; background: linear-gradient(90deg, #904AFF -31.62%, #04AB93 134.19%); border-radius: 59px;" >Connect</button>' +
                        "</div></div>" +
                        '<div class="' +
                        custom_prefix +
                        'certhisWalletPart2" style="color:#000000;">' +
                        '<div style="margin-bottom: 25px; margin-top: 25px; font-size: 14px; color: #807979;"> '+text_wallet_connect_with+' </div>' +
                        '<button id="' +
                        id_insert +
                        '-certhis-metamask-button" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;padding-left: 17px;margin-bottom: 30px;margin-top:20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/2.png" style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(90.17deg, #721AFF -34.45%, #04AB93 122.65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;">Connect</div></button>' +
                        '<button  id="' +
                        id_insert +
                        '-certhis-walletconnect-button" class="certhisWalletButton" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;padding-left: 17px;margin-bottom: 30px;margin-top:20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/3.png"  style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(90.17deg, #721AFF -34.45%, #04AB93 122.65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;">Connect</div></button>' +
                        '<button id="' +
                        id_insert +
                        '-certhis-coinbase-button" style="color: #000000;cursor: pointer;display: block;margin: auto;padding: 10px;font-size: 15px;padding-right: 17px;padding-left: 17px;margin-bottom: 30px;margin-top:20px;border-radius: 31px;border: none;min-width: 300px;max-width: 100%;background: #F8F8F8;border-radius: 8px;"><img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/1.png" style="vertical-align: middle;height: 30px;margin-right: 10px;" ><div style="width: fit-content;display: inline-block;vertical-align: initial;background: linear-gradient(90.17deg, #721AFF -34.45%, #04AB93 122.65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;border: 1px solid #000000;border-radius: 59px;padding: 4px;font-size: 15px;padding-right: 15px;padding-left: 15px;padding-top: 5px;line-height: 20px;">Connect</div></button>' +
                        '</div><div style="font-size: 12px;color: #807979;width: 250px;margin: auto;margin-top: 40px;margin-bottom:10px;">* By connecting your wallet, you accept our <a href="https://certhis.io/terms-of-use">Terms of Use</a> and acknowledge that you have read our <a href="https://certhis.io/privacy-policy">Privacy Policy</a>.</div></div>' +
                        '<div style="text-align:center;display:none;" id="' +
                        id_insert +
                        '-step2CerthisWallet">' +
                        '<div id="' +
                        id_insert +
                        '-certhisWalletPrevious" class="' +
                        custom_prefix +
                        'certhisWalletPrevious" style="cursor: pointer;    margin-top: 20px;    margin-right: auto;    text-align: left;    margin-left: 20px;    font-size: 13px;    width: fit-content;    margin-bottom: 20px;    text-transform: capitalize;    color: #505050;    position: absolute;    display: block;    top: 0;    left: 0;">&#8592 previous</div>'+
                        '<img src="https://utility-apps-assets.certhis.io/certhisWallet/wallet_logo/certhis_wallet.png" style="max-height: 40px;margin-top: 30px;margin-bottom: 20px;" class="' +
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
                        '<div style="font-size: 13px;    margin-bottom: 20px;    margin-top: 30px;    color: #807979;    line-height: 21px;">Didn\'t recived the code? <span id="' +
                        id_insert +
                        '-certhiswalletResend" style="-decoration: underline;cursor: pointer;display:block;background: linear-gradient(90.17deg, #721AFF -34.45%, #04AB93 122.65%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;background-clip: text;text-fill-color: transparent;">Resend</span></div>' +
                        '<button id="' +
                        id_insert +
                        '-validCodeCerthisWallet" style="width: fit-content;    font-size: 17px;    font-weight: lighter;    cursor: pointer;    margin-top: 10px;    margin-bottom: 10px;    background: #FFFFFF 0% 0% no-repeat padding-box;       border: none;    border-radius: 50px;    color: #fff;   padding: 5px;padding-left: 35px;padding-right: 35px;   background: linear-gradient(90deg, #904AFF -31.62%, #04AB93 134.19%);    border-radius: 59px;"  class="' +
                        custom_prefix +
                        'certhisWalletValidCode">Connect Now</button>' +
                        "</div>" +
                        '<div style="text-align:center;display:none;" id="' +
                        id_insert +
                        '-step3CerthisWallet">' +
                        '<div style="    margin-bottom: 20px;">Validating Code ...</div>' +
                        '<img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K" />' +
                        "</div>";

                    if (id_insert == "popupCerthis") {
                        InsertHTMLBOX = InsertHTMLBOX + "</div>";
                    }

                    const style = document.createElement("style")
                    style.textContent = ".certhisWalletStyle a {color:#000 !important} .certhisWallet { font-family: arial !important;} .certhisWalletStyle button{font-family: Arial;} .certhisWalletStyle button:hover{ box-shadow: 0px 0px 4px rgb(0 0 0 / 25%), 0px 4px 4px rgb(0 0 0 / 25%);}  .certhisWalletStyle input::placeholder { font-family:Arial; }  @media only screen and (max-width:500px) { #popup-content-certhis{ width:95%; } }"
                    document.body.appendChild(style);

                        
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
                                        Number(event.target.id.split("-")[3]) +
                                        1
                                    }`
                                );

                                if (
                                    Number(event.target.id.split("-")[3]) == 5
                                ) {
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
                            console.log(
                                `#${id_insert}-certhis-code-${
                                    Number(event.target.id.split("-")[3]) - 1
                                }`
                            );
                            if (
                                event.key === "Backspace" &&
                                event.target.value.length === 0
                            ) {
                                if (
                                    Number(event.target.id.split("-")[3]) >= 2
                                ) {
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
                                localStorage.removeItem("CONNECTED");
                                localStorage.removeItem("WALLET_CERTHIS");
                                localStorage.removeItem("WALLET_ECRYPTED_KEY");

                                var popupCerthis =
                                    document.getElementById("popupCerthis");
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
                            var LoadCoinbase = new InjectCoinbase({
                                appName: "Certhis Wallet",
                                appLogoUrl:
                                    "https://certhis.io/assets/images/logo.png",
                                darkMode: false,
                                overrideIsMetaMask: false,
                            });
                            try {
                                var provider = LoadCoinbase.makeWeb3Provider(
                                    rpcUrl,
                                    rpcId
                                );
                                await provider.send("eth_requestAccounts");
                                localStorage.setItem("WALLET_TYPE", "COINBASE");
                                localStorage.setItem("CONNECTED", true);
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
                    var checkcerthisWalletConnect =
                        certhisWalletConnect.addEventListener(
                            "click",
                            async function () {
                                try {
                                    var provider = new InjectWalletConnect({
                                        infuraId:
                                            "56e93ff3382e494782c4d6e2d8d1c902", // Required
                                    });
                                    console.log("enable walletconnect");
                                    try {
                                        // statements
                                        var enableProvider =
                                            await provider.enable();
                                        console.log(enableProvider);
                                        console.log("enable walletconnect2");
                                        localStorage.setItem(
                                            "WALLET_TYPE",
                                            "WALLETCONNECT"
                                        );
                                        localStorage.setItem("CONNECTED", true);
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
                            if (window.ethereum) {
                                if (window.ethereum.isMetaMask == true) {
                                    console.log(window.ethereum);
                                    try {
                                        try {
                                            const accounts =
                                                await window.ethereum.enable();
                                            localStorage.setItem(
                                                "WALLET_TYPE",
                                                "METAMASK"
                                            );
                                            localStorage.setItem(
                                                "CONNECTED",
                                                true
                                            );
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
                                        window.open(
                                            "https://metamask.io/download/",
                                            "_blank"
                                        );
                                    }
                                } else {
                                    window.open(
                                        "https://metamask.io/download/",
                                        "_blank"
                                    );
                                }
                            } else {
                                //popup install metamask
                                window.open(
                                    "https://metamask.io/download/",
                                    "_blank"
                                );
                            }
                        }
                    );

                    var certhiswalletResend = document.querySelector(
                        "#" + id_insert + "-certhiswalletResend"
                    );

                    var certhiswalletResendN =
                        certhiswalletResend.cloneNode(true);

                    certhiswalletResend.parentNode.replaceChild(
                        certhiswalletResendN,
                        certhiswalletResend
                    );
                    var blockResend = false;
                    var checkcerthiswalletSecurityResend =
                        certhiswalletResendN.addEventListener(
                            "click",
                            async function () {
                                if (blockResend == false) {
                                    blockResend = true;

                                    let time = 0;

                                    var interval = setInterval(() => {
                                        var time_to_show = 220 - time;
                                        certhiswalletResendN.textContent = `Code Sent. ( Wait ${time_to_show} Secondes for a new code )`;
                                        time++;

                                        certhiswalletResendN.style[
                                            "text-decoration"
                                        ] = "none";

                                        if (time >= 220) {
                                            clearInterval(interval);
                                        }
                                    }, 1000);

                                    var send_auth = await certhisWallet.auth(
                                        localStorage.getItem("WALLET_EMAIL")
                                    );

                                    setTimeout(() => {
                                        blockResend = false;
                                        certhiswalletResendN.style[
                                            "text-decoration"
                                        ] = "underline";
                                        certhiswalletResendN.textContent =
                                            "Resend";
                                    }, 22000);
                                }
                            }
                        );

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
                            const ErrorMessageCerthisWallet =
                                document.querySelector(
                                    "#" +
                                        id_insert +
                                        "-ErrorMessageCerthisWallet"
                                );
                            if (isValidEmail) {
                                ErrorMessageCerthisWallet.style.display =
                                    "None";

                                //generate wallet
                                var get_wallet = await certhisWallet.wallet(
                                    email
                                );
                                get_wallet = get_wallet.data;
                                var wallet = get_wallet.wallet;
                                var send_auth = await certhisWallet.auth(email);
                                send_auth = send_auth.data;
                                localStorage.setItem("WALLET_CERTHIS", wallet);
                                step1.style.display = "none";
                                step2.style.display = "block";
                            } else {
                                ErrorMessageCerthisWallet.textContent =
                                    "Invalid Email Address";
                                ErrorMessageCerthisWallet.style.display =
                                    "block";
                            }
                        }
                    );

                    const validCodeCerthisWallet = document.querySelector(
                        "#" + id_insert + "-validCodeCerthisWallet"
                    );
                    let validBlock = false;
                    var checkValidCode =
                        validCodeCerthisWallet.addEventListener(
                            "click",
                            function () {
                                validCode();
                            }
                        );

                    async function validCode() {
                        console.log("validCode");
                        const ErrorMessageCerthisWalletAuthCode =
                            document.querySelector(
                                "#" +
                                    id_insert +
                                    "-ErrorMessageCerthisWalletAuthCode"
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
                                ErrorMessageCerthisWalletAuthCode.style.display =
                                    "None";

                                step2.style.display = "None";
                                step3.style.display = "block";

                                var validCode = await certhisWallet.check(
                                    localStorage.getItem("WALLET_CERTHIS"),
                                    code
                                );

                                validCode = validCode.data;

                                if (validCode.encrypted_key != undefined) {
                                    const emailInput = document.querySelector(
                                        "#" + id_insert + "-certhisWalletEmail"
                                    );
                                    const email = emailInput.value;
                                    localStorage.setItem(
                                        "WALLET_ECRYPTED_KEY",
                                        validCode.encrypted_key
                                    );
                                    localStorage.setItem("WALLET_EMAIL", email);

                                    var getProvider =
                                        await providerFunction.getProvider(
                                            rpcUrl,
                                            localStorage.getItem(
                                                "WALLET_CERTHIS"
                                            ),
                                            validCode.encrypted_key
                                        );
                                    if (id_insert == "popupCerthis") {
                                        boxCerthis.style.display = "none";
                                    }
                                    localStorage.setItem("CONNECTED", true);
                                    resolve(getProvider);
                                    step1.style.display = "block";
                                    step2.style.display = "none";
                                    step3.style.display = "none";
                                } else {
                                    ErrorMessageCerthisWalletAuthCode.textContent =
                                        "Invalid Code";
                                    ErrorMessageCerthisWalletAuthCode.style.display =
                                        "block";
                                    step2.style.display = "block";
                                    step3.style.display = "None";
                                    validBlock = false;
                                }
                            } else {
                                ErrorMessageCerthisWalletAuthCode.textContent =
                                    "Invalid Code Format";
                                ErrorMessageCerthisWalletAuthCode.style.display =
                                    "block";
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
