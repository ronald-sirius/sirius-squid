import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface AddLiquidity0Event {
  provider: string;
  tokenAmounts: Array<ethers.BigNumber>;
  fee: ethers.BigNumber;
  tokenSupply: ethers.BigNumber;
  price: ethers.BigNumber;
}

export interface OwnershipTransferred0Event {
  previousOwner: string;
  newOwner: string;
}

export interface Paused0Event {
  account: string;
}

export interface RemoveLiquidity0Event {
  provider: string;
  tokenAmounts: Array<ethers.BigNumber>;
  tokenSupply: ethers.BigNumber;
  price: ethers.BigNumber;
}

export interface RemoveLiquidityOne0Event {
  provider: string;
  tokenAmount: ethers.BigNumber;
  coinIndex: ethers.BigNumber;
  coinAmount: ethers.BigNumber;
  price: ethers.BigNumber;
}

export interface TokenExchange0Event {
  buyer: string;
  soldId: ethers.BigNumber;
  tokensSold: ethers.BigNumber;
  boughtId: ethers.BigNumber;
  tokensBought: ethers.BigNumber;
  price: ethers.BigNumber;
}

export interface Unpaused0Event {
  account: string;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "AddLiquidity(address,uint256[],uint256,uint256,uint256)":  {
    topic: abi.getEventTopic("AddLiquidity(address,uint256[],uint256,uint256,uint256)"),
    decode(data: EvmEvent): AddLiquidity0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("AddLiquidity(address,uint256[],uint256,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmounts: result[1],
        fee: result[2],
        tokenSupply: result[3],
        price: result[4],
      }
    }
  }
  ,
  "OwnershipTransferred(address,address)":  {
    topic: abi.getEventTopic("OwnershipTransferred(address,address)"),
    decode(data: EvmEvent): OwnershipTransferred0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("OwnershipTransferred(address,address)"),
        data.data || "",
        data.topics
      );
      return  {
        previousOwner: result[0],
        newOwner: result[1],
      }
    }
  }
  ,
  "Paused(address)":  {
    topic: abi.getEventTopic("Paused(address)"),
    decode(data: EvmEvent): Paused0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Paused(address)"),
        data.data || "",
        data.topics
      );
      return  {
        account: result[0],
      }
    }
  }
  ,
  "RemoveLiquidity(address,uint256[2],uint256,uint256)":  {
    topic: abi.getEventTopic("RemoveLiquidity(address,uint256[2],uint256,uint256)"),
    decode(data: EvmEvent): RemoveLiquidity0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RemoveLiquidity(address,uint256[2],uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmounts: result[1],
        tokenSupply: result[2],
        price: result[3],
      }
    }
  }
  ,
  "RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)":  {
    topic: abi.getEventTopic("RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): RemoveLiquidityOne0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmount: result[1],
        coinIndex: result[2],
        coinAmount: result[3],
        price: result[4],
      }
    }
  }
  ,
  "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)":  {
    topic: abi.getEventTopic("TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): TokenExchange0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        buyer: result[0],
        soldId: result[1],
        tokensSold: result[2],
        boughtId: result[3],
        tokensBought: result[4],
        price: result[5],
      }
    }
  }
  ,
  "Unpaused(address)":  {
    topic: abi.getEventTopic("Unpaused(address)"),
    decode(data: EvmEvent): Unpaused0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Unpaused(address)"),
        data.data || "",
        data.topics
      );
      return  {
        account: result[0],
      }
    }
  }
  ,
}

function getJsonAbi(): any {
  return [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "tokenAmounts",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "AddLiquidity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[2]",
          "name": "tokenAmounts",
          "type": "uint256[2]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "coinIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "coinAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidityOne",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "soldId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensSold",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "boughtId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensBought",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "TokenExchange",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "BASE_POOL",
      "outputs": [
        {
          "internalType": "contract ISwap",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "META_LPTOKEN",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "META_POOL",
      "outputs": [
        {
          "internalType": "contract IXSwap",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "N_COINS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "N_STABLECOINS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "N_UL_COINS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PRECISION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "UNDERLYING_COINS",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISwap",
          "name": "_baseSwap",
          "type": "address"
        },
        {
          "internalType": "contract IXSwap",
          "name": "_metaSwap",
          "type": "address"
        },
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "_metaLPToken",
          "type": "address"
        }
      ],
      "name": "__XMetaSwapDeposit_init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_minMintAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "baseTokens",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "calcTokenAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        }
      ],
      "name": "calcWithdrawOneCoin",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_j",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minDy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "exchangeUnderlying",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_j",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dx",
          "type": "uint256"
        }
      ],
      "name": "getDyUnderlying",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "metaTokens",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "priceOracle",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "priceScale",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_minAmounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_tokenIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_minAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityOneToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}
