import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface AddLiquidity0Event {
  provider: string;
  tokenAmounts: Array<ethers.BigNumber>;
  fees: Array<ethers.BigNumber>;
  invariant: ethers.BigNumber;
  lpTokenSupply: ethers.BigNumber;
}

export interface NewAdminFee0Event {
  newAdminFee: ethers.BigNumber;
}

export interface NewSwapFee0Event {
  newSwapFee: ethers.BigNumber;
}

export interface NewWithdrawFee0Event {
  newWithdrawFee: ethers.BigNumber;
}

export interface OwnershipTransferred0Event {
  previousOwner: string;
  newOwner: string;
}

export interface Paused0Event {
  account: string;
}

export interface RampA0Event {
  oldA: ethers.BigNumber;
  newA: ethers.BigNumber;
  initialTime: ethers.BigNumber;
  futureTime: ethers.BigNumber;
}

export interface RemoveLiquidity0Event {
  provider: string;
  tokenAmounts: Array<ethers.BigNumber>;
  lpTokenSupply: ethers.BigNumber;
}

export interface RemoveLiquidityImbalance0Event {
  provider: string;
  tokenAmounts: Array<ethers.BigNumber>;
  fees: Array<ethers.BigNumber>;
  invariant: ethers.BigNumber;
  lpTokenSupply: ethers.BigNumber;
}

export interface RemoveLiquidityOne0Event {
  provider: string;
  lpTokenAmount: ethers.BigNumber;
  lpTokenSupply: ethers.BigNumber;
  boughtId: ethers.BigNumber;
  tokensBought: ethers.BigNumber;
}

export interface StopRampA0Event {
  currentA: ethers.BigNumber;
  time: ethers.BigNumber;
}

export interface TokenSwap0Event {
  buyer: string;
  tokensSold: ethers.BigNumber;
  tokensBought: ethers.BigNumber;
  soldId: ethers.BigNumber;
  boughtId: ethers.BigNumber;
}

export interface Unpaused0Event {
  account: string;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "AddLiquidity(address,uint256[],uint256[],uint256,uint256)":  {
    topic: abi.getEventTopic("AddLiquidity(address,uint256[],uint256[],uint256,uint256)"),
    decode(data: EvmEvent): AddLiquidity0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("AddLiquidity(address,uint256[],uint256[],uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmounts: result[1],
        fees: result[2],
        invariant: result[3],
        lpTokenSupply: result[4],
      }
    }
  }
  ,
  "NewAdminFee(uint256)":  {
    topic: abi.getEventTopic("NewAdminFee(uint256)"),
    decode(data: EvmEvent): NewAdminFee0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("NewAdminFee(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        newAdminFee: result[0],
      }
    }
  }
  ,
  "NewSwapFee(uint256)":  {
    topic: abi.getEventTopic("NewSwapFee(uint256)"),
    decode(data: EvmEvent): NewSwapFee0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("NewSwapFee(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        newSwapFee: result[0],
      }
    }
  }
  ,
  "NewWithdrawFee(uint256)":  {
    topic: abi.getEventTopic("NewWithdrawFee(uint256)"),
    decode(data: EvmEvent): NewWithdrawFee0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("NewWithdrawFee(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        newWithdrawFee: result[0],
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
  "RampA(uint256,uint256,uint256,uint256)":  {
    topic: abi.getEventTopic("RampA(uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): RampA0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RampA(uint256,uint256,uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        oldA: result[0],
        newA: result[1],
        initialTime: result[2],
        futureTime: result[3],
      }
    }
  }
  ,
  "RemoveLiquidity(address,uint256[],uint256)":  {
    topic: abi.getEventTopic("RemoveLiquidity(address,uint256[],uint256)"),
    decode(data: EvmEvent): RemoveLiquidity0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RemoveLiquidity(address,uint256[],uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmounts: result[1],
        lpTokenSupply: result[2],
      }
    }
  }
  ,
  "RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)":  {
    topic: abi.getEventTopic("RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)"),
    decode(data: EvmEvent): RemoveLiquidityImbalance0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        provider: result[0],
        tokenAmounts: result[1],
        fees: result[2],
        invariant: result[3],
        lpTokenSupply: result[4],
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
        lpTokenAmount: result[1],
        lpTokenSupply: result[2],
        boughtId: result[3],
        tokensBought: result[4],
      }
    }
  }
  ,
  "StopRampA(uint256,uint256)":  {
    topic: abi.getEventTopic("StopRampA(uint256,uint256)"),
    decode(data: EvmEvent): StopRampA0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("StopRampA(uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        currentA: result[0],
        time: result[1],
      }
    }
  }
  ,
  "TokenSwap(address,uint256,uint256,uint128,uint128)":  {
    topic: abi.getEventTopic("TokenSwap(address,uint256,uint256,uint128,uint128)"),
    decode(data: EvmEvent): TokenSwap0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("TokenSwap(address,uint256,uint256,uint128,uint128)"),
        data.data || "",
        data.topics
      );
      return  {
        buyer: result[0],
        tokensSold: result[1],
        tokensBought: result[2],
        soldId: result[3],
        boughtId: result[4],
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
          "internalType": "uint256[]",
          "name": "fees",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "invariant",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lpTokenSupply",
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
          "indexed": false,
          "internalType": "uint256",
          "name": "newAdminFee",
          "type": "uint256"
        }
      ],
      "name": "NewAdminFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newSwapFee",
          "type": "uint256"
        }
      ],
      "name": "NewSwapFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newWithdrawFee",
          "type": "uint256"
        }
      ],
      "name": "NewWithdrawFee",
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
          "indexed": false,
          "internalType": "uint256",
          "name": "oldA",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newA",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initialTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "futureTime",
          "type": "uint256"
        }
      ],
      "name": "RampA",
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
          "internalType": "uint256[]",
          "name": "tokenAmounts",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lpTokenSupply",
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
          "internalType": "uint256[]",
          "name": "tokenAmounts",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "fees",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "invariant",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lpTokenSupply",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidityImbalance",
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
          "name": "lpTokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lpTokenSupply",
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
        }
      ],
      "name": "RemoveLiquidityOne",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currentA",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "StopRampA",
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
          "name": "tokensSold",
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
          "internalType": "uint128",
          "name": "soldId",
          "type": "uint128"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "boughtId",
          "type": "uint128"
        }
      ],
      "name": "TokenSwap",
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
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "minToMint",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
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
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "calculateRemoveLiquidity",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "tokenIndex",
          "type": "uint8"
        }
      ],
      "name": "calculateRemoveLiquidityOneToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "availableTokenAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "tokenIndexFrom",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "tokenIndexTo",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "dx",
          "type": "uint256"
        }
      ],
      "name": "calculateSwap",
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
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bool",
          "name": "deposit",
          "type": "bool"
        }
      ],
      "name": "calculateTokenAmount",
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
      "name": "getA",
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
      "name": "getAPrecise",
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
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getAdminBalance",
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
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        }
      ],
      "name": "getToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
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
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        }
      ],
      "name": "getTokenBalance",
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
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        }
      ],
      "name": "getTokenIndex",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVirtualPrice",
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
          "internalType": "contract IERC20[]",
          "name": "_pooledTokens",
          "type": "address[]"
        },
        {
          "internalType": "uint8[]",
          "name": "decimals",
          "type": "uint8[]"
        },
        {
          "internalType": "string",
          "name": "lpTokenName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "lpTokenSymbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_a",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_adminFee",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "lpTokenTargetAddress",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "futureA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "futureTime",
          "type": "uint256"
        }
      ],
      "name": "rampA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "minAmounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "maxBurnAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityImbalance",
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
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "tokenIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "minAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
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
          "internalType": "uint256",
          "name": "newAdminFee",
          "type": "uint256"
        }
      ],
      "name": "setAdminFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newSwapFee",
          "type": "uint256"
        }
      ],
      "name": "setSwapFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stopRampA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "tokenIndexFrom",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "tokenIndexTo",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "dx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minDy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swap",
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
      "name": "swapStorage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "initialA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "futureA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "initialATime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "futureATime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "swapFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "adminFee",
          "type": "uint256"
        },
        {
          "internalType": "contract LPToken",
          "name": "lpToken",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
    },
    {
      "inputs": [],
      "name": "withdrawAdminFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}
