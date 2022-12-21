const Web3 = require("web3");
import { ethers } from "ethers";
const abiCerthis = require("./../abi");
const certhis_wallet = require("./../index").init(Web3);
let provider;
let wallet;
let web3;
document.addEventListener("DOMContentLoaded", async function () {
	const disconnect = document.querySelector("#disconnect");
	var checkDisconnect = disconnect.addEventListener(
		"click",
		async function () {
			provider = await certhis_wallet.disconnect();
			document.querySelector(".not_connected").style.display = "block";

			document.querySelector(".connected").style.display = "none";
		}
	);

	var getProvider = await certhis_wallet.run("connectBox_certhis");
	provider = getProvider;
	accountInfo();

	const onsignMessage = document.querySelector("#signMessage");
	var checkonsignTransaction = onsignMessage.addEventListener(
		"click",
		async function () {
			const wallet = new ethers.providers.Web3Provider(provider);
			const signer = await wallet.getSigner();
			const message_sign = await signer.signMessage("message a signer");

			document.querySelector("#resultSignature").innerText = message_sign;
		}
	);

	const onswitchChain = document.querySelector("#switchChain");
	var checkononswitchChain = onswitchChain.addEventListener(
		"click",
		async function () {
			try {
				await provider
					.request({
						method: "wallet_switchEthereumChain",
						params: [
							{
								chainId: Web3.utils.toHex(137),
							},
						],
					})
					.then(async (success) => {
						document.querySelector("#resultswitchChain").innerText =
							"true";
					});
			} catch (e) {
				console.log(e);
				document.querySelector("#resultswitchChain").innerText =
					"false";
			}
		}
	);

	const onCallContract = document.querySelector("#callContract");
	var checkonCallContract = onsignMessage.addEventListener(
		"click",
		async function () {
			var contract_certhis = new web3.eth.Contract(
				abiCerthis.abi,
				"0xfD45112669611Cda7e65AD54e254DcF9B12D0AB3"
			);

			document.querySelector("#resultCallContract").innerText = "true";
		}
	);
});

var connect_list = false;
var onChainChanged = false;
var onAccountChanged = false;

function accountInfo() {
	try {
		if (connect_list == false) {
			connect_list = provider.on("connect", function (accounts) {
				consolelog("connect");
				accountInfo();
			});
		}

		if (onChainChanged == false) {
			onChainChanged = provider.on(
				"networkChanged",
				async function (chain) {
					const chainId = await web3.eth.net.getId();
					document.querySelector("#chain_id").innerText = chainId;
				}
			);
		}

		if (onAccountChanged == false) {
			onAccountChanged = provider.on(
				"accountsChanged",
				async function (accounts) {
					var getProvider = await certhis_wallet.run(
						"connectBox_certhis"
					);
					provider = getProvider;
					accountInfo();
				}
			);
		}
	} catch (e) {
		console.log(e);
		return;
	}

	web3 = new Web3(provider);
	web3.eth.getAccounts().then(async (accounts) => {
		if (!empty(accounts[0])) {
			const balance = web3.utils.fromWei(
				await web3.eth.getBalance(accounts[0])
			);
			const chainId = await web3.eth.net.getId();
			document.querySelector("#balance_wallet").innerText = balance;
			document.querySelector("#chain_id").innerText = chainId;
			document.querySelector(".not_connected").style.display = "none";
			document.querySelector(".connected").style.display = "block";
			document.querySelector("#disconnect").style.display = "block";
			const span = (document.querySelector(
				"#connected_wallet"
			).innerText = accounts[0]);
		}
	});
}

window.empty = function (data) {
	if (typeof data == "number" || typeof data == "boolean") {
		return false;
	}
	if (typeof data == "undefined" || data === null) {
		return true;
	}
	if (typeof data.length != "undefined") {
		return data.length == 0;
	}
	var count = 0;
	for (var i in data) {
		if (data.hasOwnProperty(i)) {
			count++;
		}
	}
	return count == 0;
};
