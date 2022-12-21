module.exports.abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_default_certhis_payout",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_default_certhis_payout_mint",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_collection_id",
				"type": "uint256"
			}
		],
		"name": "return_collection_id",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_label_id",
				"type": "uint256"
			}
		],
		"name": "return_label_id",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "certhis_default",
		"outputs": [
			{
				"internalType": "address",
				"name": "default_certhis_payout",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "default_certhis_payout_mint",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "max_tax_label",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "max_tax_label_mint",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "max_tax_collection",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "default_collection_certhis_tax",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "default_collection_certhis_tax_mint",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "max_royalties",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "max_tax_affiliation",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "max_tax_share_royalties",
				"type": "uint16"
			},
			{
				"internalType": "bool",
				"name": "freeze_label_creation",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "freeze_collection_creation",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_collection_id",
				"type": "uint256"
			}
		],
		"name": "get_collection",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "label_id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "collection_id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "collection_address",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator_address",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "collection_uri",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "collection_type",
						"type": "bool"
					},
					{
						"internalType": "uint16",
						"name": "collection_tax",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "collection_payout",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "mintable_activate",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "currency_for_mint",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price_for_mint",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "collection_payout_mint",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "root_price",
						"type": "bytes32"
					},
					{
						"internalType": "uint16",
						"name": "collection_full",
						"type": "uint16"
					},
					{
						"internalType": "bytes32",
						"name": "root",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "mint_start",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "mint_end",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sell_id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_mint",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_mint_sell",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_supply",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "affiliation",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "share_royalties",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "tax_descativate",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "collection_certhis_tax",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "collection_certhis_tax_mint",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "check_contract",
						"type": "address"
					}
				],
				"internalType": "struct certhis_struct.Collection",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_label_id",
				"type": "uint256"
			}
		],
		"name": "get_label",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "label_id",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "label_tax",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "label_payout",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "label_tax_mint",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "label_payout_mint",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator_address",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "affiliation",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "affiliation_tax",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "affiliation_tax_mint",
						"type": "uint16"
					}
				],
				"internalType": "struct certhis_struct.Label",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_edit",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "label_id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "collection_id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "collection_address",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator_address",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "collection_uri",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "collection_type",
						"type": "bool"
					},
					{
						"internalType": "uint16",
						"name": "collection_tax",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "collection_payout",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "mintable_activate",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "currency_for_mint",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price_for_mint",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "collection_payout_mint",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "root_price",
						"type": "bytes32"
					},
					{
						"internalType": "uint16",
						"name": "collection_full",
						"type": "uint16"
					},
					{
						"internalType": "bytes32",
						"name": "root",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "mint_start",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "mint_end",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "sell_id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_mint",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_mint_sell",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_supply",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "affiliation",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "share_royalties",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "tax_descativate",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "collection_certhis_tax",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "collection_certhis_tax_mint",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "check_contract",
						"type": "address"
					}
				],
				"internalType": "struct certhis_struct.Collection",
				"name": "_collection_obj",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "_collection_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_collection_symbole",
				"type": "string"
			}
		],
		"name": "manage_collection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_edit",
				"type": "bool"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "label_id",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "label_tax",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "label_payout",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "label_tax_mint",
						"type": "uint16"
					},
					{
						"internalType": "address",
						"name": "label_payout_mint",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator_address",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "affiliation",
						"type": "address"
					},
					{
						"internalType": "uint16",
						"name": "affiliation_tax",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "affiliation_tax_mint",
						"type": "uint16"
					}
				],
				"internalType": "struct certhis_struct.Label",
				"name": "_label_obj",
				"type": "tuple"
			}
		],
		"name": "manage_label",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "default_certhis_payout",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "default_certhis_payout_mint",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "max_tax_label",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_tax_label_mint",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max_tax_collection",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "default_collection_certhis_tax",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "default_collection_certhis_tax_mint",
						"type": "uint16"
					},
					{
						"internalType": "uint256",
						"name": "max_royalties",
						"type": "uint256"
					},
					{
						"internalType": "uint16",
						"name": "max_tax_affiliation",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "max_tax_share_royalties",
						"type": "uint16"
					},
					{
						"internalType": "bool",
						"name": "freeze_label_creation",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "freeze_collection_creation",
						"type": "bool"
					}
				],
				"internalType": "struct certhis_struct.CERTHIS_DEFAULT",
				"name": "_update_default",
				"type": "tuple"
			}
		],
		"name": "update_default",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];