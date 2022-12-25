"use strict";

/**
 * @module certhis-wallet
 */

module.exports = function (Web3, CoinbaseWalletSDK, WalletConnectProvider) {
	const providerLib = require("./provider");
	const InjectCoinbase = CoinbaseWalletSDK;
	const InjectWalletConnect = WalletConnectProvider;
	var axios = require("axios");
	var request = require("./request")(axios, "http://localhost:2626/");
	const providerFunction = providerLib(Web3, request);
	const certhisWallet = require("./certhisWallet")(request);
	const rpcinfo = require("./rpc");
	var rpc_array = rpcinfo.rpc_array;
	return {
		disconnect: async function () {
			return new Promise(async (resolve, reject) => {
				localStorage.removeItem("CONNECTED");
				localStorage.removeItem("walletconnect");
				localStorage.removeItem("WALLET_CERTHIS");
				localStorage.removeItem("WALLET_CERTHIS_PRIVATE_KEY");
				localStorage.removeItem("RPC_CERTHIS");
				localStorage.removeItem("RPC_ID_CERTHIS");
				localStorage.removeItem("WALLET_TYPE");
				resolve(null);
			});
		},
		run: async function (rpc_id, rpc, id_insert = "popupCerthis") {
			return new Promise(async (resolve, reject) => {
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
						resolve(ethereum);
					} else if (localStorage.getItem("WALLET_TYPE") == "COINBASE") {
						var LoadCoinbase = new InjectCoinbase({
							appName: "Certhis Wallet",
							appLogoUrl: "https://certhis.io/assets/images/logo.png",
							darkMode: false,
							overrideIsMetaMask: false,
						});

						var provider = LoadCoinbase.makeWeb3Provider(rpcUrl, rpcId);
						await provider.send("eth_requestAccounts");
						resolve(provider);
					} else if (localStorage.getItem("WALLET_TYPE") == "WALLETCONNECT") {
						var provider = new InjectWalletConnect({
							infuraId: "56e93ff3382e494782c4d6e2d8d1c902", // Required
						});
						await provider.enable();
						resolve(provider);
					} else {
						var getProvider = await providerFunction.getProvider(
							rpcUrl,
							localStorage.getItem("WALLET_CERTHIS"),
							localStorage.getItem("WALLET_CERTHIS_PRIVATE_KEY")
						);
					}

					resolve(getProvider);
				} else if (!boxCerthis || id_insert != "popupCerthis") {
					if (id_insert == "popupCerthis") {
						boxCerthis = document.createElement("div");
						boxCerthis.style.position = "fixed";
						boxCerthis.style.width = "100%";
						boxCerthis.style.height = "100%";
						boxCerthis.style.top = 0;
						boxCerthis.style.background = "#ffffffa3";
						boxCerthis.style["text-align"] = "center";
						boxCerthis.style.display = "grid";
					}

					boxCerthis.id = id_insert;

					var InsertHTMLBOX = "";

					if (id_insert == "popupCerthis") {
						InsertHTMLBOX =
							'<div id="box-content-certhis" style="position: relative;height: 300px;display: grid;align-content: center;box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;width: 300px;border-radius:10px;">' +
							'<div id="closePopup" style="position: absolute;width: fit-content;right: 10px;cursor: pointer;top: 10px;">X</div>';
					}
					InsertHTMLBOX =
						InsertHTMLBOX +
						'<div class="certhisWalletPart1"><div style="font-size:25px;margin-bottom: 20px;text-align: center;">Certhis Wallet</div>' +
						'<div style="text-align:center;" id="step1CerthisWallet">' +
						'<div id="ErrorMessageCerthisWallet" style="display:none;color:red;"></div>' +
						'<input type="email" id="certhisWalletEmail" placeholder="your email" style="display: block;margin: auto;margin-bottom: 20px;">' +
						'<button id="connectCerthis">Connect</button>' +
						'</div><div class="certhisWalletPart2"><div style="margin-top: 17px;margin-bottom: 15px;font-size: 20px;">Or Connect With</div>' +
						'<button id="certhis-metamask-button" style="cursor: pointer;display: block;margin: auto;background: #fff;border: 1px solid;padding: 10px;font-size: 17px;border-radius: 5px;padding-right: 17px;padding-left: 17px;margin-bottom: 10px;">Metamask</button>' +
						'<button id="certhis-walletconnect-button" style="cursor: pointer;display: block;margin: auto;background: #fff;border: 1px solid;padding: 10px;font-size: 17px;border-radius: 5px;padding-right: 17px;padding-left: 17px;margin-bottom: 10px;">Wallet Connect</button>' +
						'<button id="certhis-coinbase-button" style="cursor: pointer;display: block;margin: auto;background: #fff;border: 1px solid;padding: 10px;font-size: 17px;border-radius: 5px;padding-right: 17px;padding-left: 17px;margin-bottom: 10px;">Coinbase Wallet</button>' +
						"</div></div>" +
						'<div style="text-align:center;display:none;" id="step2CerthisWallet">' +
						'<div style="margin-bottom: 20px;">You have received a code via email.<br>Please enter the code to log in</div>' +
						'<div id="ErrorMessageCerthisWalletAuthCode" style="margin-bottom: 20px;display:none;color:red;"></div>' +
						'<input type="text" id="certhis-code-1" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
						'<input type="text" id="certhis-code-2" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
						'<input type="text" id="certhis-code-3" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
						'<input type="text" id="certhis-code-4" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
						'<input type="text" id="certhis-code-5" style="width: 30px;height: 30px;margin-right: 3px;display: inline-block;" maxlength="1">' +
						'<div id="certhisWalletPrevious" style="    cursor: pointer;margin-top: 15px;margin-right: auto;text-align: left;margin-left: 20px;width: fit-content;margin-bottom: 15px;">< previous</div><button id="validCodeCerthisWallet">valid</button>' +
						"</div>" +
						'<div style="text-align:center;display:none;" id="step3CerthisWallet">' +
						'<div style="    margin-bottom: 20px;">Validating Code ...</div>' +
						'<img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K" />' +
						"</div>";

					if (id_insert == "popupCerthis") {
						InsertHTMLBOX = InsertHTMLBOX + "</div>";
					}
					boxCerthis.innerHTML = InsertHTMLBOX;

					if (id_insert == "popupCerthis") {
						document.body.appendChild(boxCerthis);
					}

					for (let i = 1; i <= 5; i++) {
						const input = document.querySelector(`#certhis-code-${i}`);
						input.addEventListener("input", function (event) {
							const value = event.target.value;
							if (value.length === 1) {
								const nextInput = document.querySelector(
									`#certhis-code-${Number(event.target.id.split("-")[2]) + 1}`
								);

								if (Number(event.target.id.split("-")[2]) == 5) {
									validCode();
								}
								nextInput.focus();
							}
						});

						input.addEventListener("keydown", function (event) {
							const previousInput = document.querySelector(
								`#certhis-code-${Number(event.target.id.split("-")[2]) - 1}`
							);
							console.log(
								`#certhis-code-${Number(event.target.id.split("-")[2]) - 1}`
							);
							if (
								event.key === "Backspace" &&
								event.target.value.length === 0
							) {
								if (Number(event.target.id.split("-")[2]) >= 2) {
									previousInput.focus();
								}
							}
						});

						input.addEventListener("paste", function (event) {
							event.preventDefault();
							const paste = event.clipboardData.getData("text");
							if (paste.length >= 5) {
								for (let j = 1; j <= 5; j++) {
									document.querySelector(`#certhis-code-${j}`).value =
										paste[j - 1];
								}
								validCode();
							}
						});
					}

					const step1 = document.querySelector("#step1CerthisWallet");
					const step2 = document.querySelector("#step2CerthisWallet");
					const step3 = document.querySelector("#step3CerthisWallet");
					if (id_insert == "popupCerthis") {
						const closePopup = document.querySelector("#closePopup");
						var checkclosePopup = closePopup.addEventListener(
							"click",
							function () {
								localStorage.removeItem("CONNECTED");
								localStorage.removeItem("WALLET_CERTHIS");
								localStorage.removeItem("WALLET_CERTHIS_PRIVATE_KEY");

								var popupCerthis = document.getElementById("popupCerthis");
								popupCerthis.style.display = "none";
							}
						);
					}

					const certhisCoinbase = document.querySelector(
						"#certhis-coinbase-button"
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
								localStorage.setItem("WALLET_TYPE", "COINBASE");
								localStorage.setItem("CONNECTED", true);
								resolve(provider);
							} catch (e) {
								reject(e);
							}
						}
					);

					const certhisWalletConnect = document.querySelector(
						"#certhis-walletconnect-button"
					);
					var checkcerthisWalletConnect = certhisWalletConnect.addEventListener(
						"click",
						async function () {
							try {

								var provider = new InjectWalletConnect({
									infuraId: "56e93ff3382e494782c4d6e2d8d1c902", // Required
								});
								await provider.enable();
								console.log(provider);
								localStorage.setItem("WALLET_TYPE", "WALLETCONNECT");
								localStorage.setItem("CONNECTED", true);
								resolve(provider);
							} catch (e) {
								reject(e);
							}
						}
					);

					const certhisMetamask = document.querySelector(
						"#certhis-metamask-button"
					);
					var checkMetamask = certhisMetamask.addEventListener(
						"click",
						async function () {
							if (window.ethereum) {
								if (window.ethereum.isMetaMask == true) {
									console.log(window.ethereum);
									try {
										const accounts = await window.ethereum.enable();
										localStorage.setItem("WALLET_TYPE", "METAMASK");
										localStorage.setItem("CONNECTED", true);
										resolve(ethereum);
									} catch (error) {
										//popup install metamask
										window.open("https://metamask.io/download/", "_blank");
									}
								} else {
									window.open("https://metamask.io/download/", "_blank");
								}
							} else {
								//popup install metamask
								window.open("https://metamask.io/download/", "_blank");
							}
						}
					);

					const certhisWalletPrevious = document.querySelector(
						"#certhisWalletPrevious"
					);
					var checkPrevious = certhisWalletPrevious.addEventListener(
						"click",
						function () {
							step2.style.display = "none";
							step1.style.display = "block";
						}
					);

					const connectCerthis = document.querySelector("#connectCerthis");

					var checkConnect = connectCerthis.addEventListener(
						"click",
						async function () {
							const emailInput = document.querySelector("#certhisWalletEmail");
							const email = emailInput.value;
							// Use a regular expression to check if the email is in a valid format
							const emailRegex =
								/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							const isValidEmail = emailRegex.test(email);
							const ErrorMessageCerthisWallet = document.querySelector(
								"#ErrorMessageCerthisWallet"
							);
							if (isValidEmail) {
								ErrorMessageCerthisWallet.style.display = "None";

								//generate wallet
								var get_wallet = await certhisWallet.wallet(email);
								get_wallet = get_wallet.data;
								var wallet = get_wallet.wallet;
								var send_auth = await certhisWallet.auth(email);
								send_auth = send_auth.data;
								localStorage.setItem("WALLET_CERTHIS", wallet);
								step1.style.display = "None";
								step2.style.display = "block";
							} else {
								ErrorMessageCerthisWallet.textContent = "Invalid Email Address";
								ErrorMessageCerthisWallet.style.display = "block";
							}
						}
					);

					const validCodeCerthisWallet = document.querySelector(
						"#validCodeCerthisWallet"
					);
					let validBlock = false;
					var checkValidCode = validCodeCerthisWallet.addEventListener(
						"click",
						function () {
							validCode();
						}
					);

					async function validCode() {
						console.log("validCode");
						const ErrorMessageCerthisWalletAuthCode = document.querySelector(
							"#ErrorMessageCerthisWalletAuthCode"
						);

						let code = "";
						for (let i = 1; i <= 5; i++) {
							const input = document.querySelector(`#certhis-code-${i}`);
							code += input.value;
						}

						const isValid = /^\d{5}$/.test(code);

						if (validBlock == false) {
							validBlock = true;
							if (isValid) {
								ErrorMessageCerthisWalletAuthCode.style.display = "None";

								step2.style.display = "None";
								step3.style.display = "block";

								var validCode = await certhisWallet.check(
									localStorage.getItem("WALLET_CERTHIS"),
									code
								);

								validCode = validCode.data;

								if (validCode.private_key != undefined) {
									localStorage.setItem(
										"WALLET_CERTHIS_PRIVATE_KEY",
										validCode.private_key
									);
									var getProvider = await providerFunction.getProvider(
										rpcUrl,
										localStorage.getItem("WALLET_CERTHIS"),
										validCode.private_key
									);
									if (id_insert == "popupCerthis") {
										boxCerthis.style.display = "none";
									}
									localStorage.setItem("CONNECTED", true);
									resolve(getProvider);
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
				} else {
					boxCerthis.style.display = "grid";
				}
			});
		},
	};
};
