import { assertNotNull, EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Swap, DailyTvl, Token, DailyVolume } from "./model";
import { events, abi } from "./abi/XSwapDeposit"
import { abi as erc20ABI } from "./abi/ERC20"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
const provider = new ethers.providers.WebSocketProvider(CHAIN_NODE);

export async function getOrCreateSwap(ctx: EvmLogHandlerContext): Promise<Swap> {
  let swap = await ctx.store.get(Swap, ctx.contractAddress)
  if (swap == null) {
    let info = await getSwapInfo(ctx.contractAddress)
    swap = new Swap({
      id: ctx.contractAddress,
      address: ctx.contractAddress,
      metaPool: info.metaPool,
      basePool: info.basePool,
      tokens: await registerTokens(info.tokens, ctx),
      baseTokens: await registerTokens(info.baseTokens, ctx),
      underlyingTokens: await registerTokens(info.underlyingTokens, ctx),
      tokensSymbol: info.tokensSymbol,
      baseTokensSymbol: info.baseTokensSymbol,
      underlyingTokensSymbol: info.underlyingTokensSymbol,
      balances: info.balances,
      tvl: 0n,
    })
  }
  await ctx.store.save(swap);
  return assertNotNull(swap);
}

export async function getBalances(swapAddress: string): Promise<bigint[]> {
  let swapContract = new ethers.Contract(swapAddress, abi, provider)
  let N_COINS = await swapContract.N_COINS()
  let META_POOL = await swapContract.META_POOL()
  let BASE_POOL = await swapContract.BASE_POOL()
  let balances = new Array<bigint>(N_COINS)
  for (let i = 0; i < N_COINS; ++i) {
    let t = await swapContract.UNDERLYING_COINS(i)
    let tokenContract = new ethers.Contract(t, erc20ABI, provider)
    let b: BigNumber
    if (i == N_COINS - 1) {
      b = await tokenContract.balanceOf(BASE_POOL)
    } else {
      b = await tokenContract.balanceOf(META_POOL)
    }
    balances[i] = b.toBigInt().valueOf()
  }
  return balances
}

class SwapInfo {
  basePool: string
  metaPool: string
  balances: bigint[]
  tokens: string[]
  tokensSymbol: string[]
  baseTokens: string[]
  baseTokensSymbol: string[]
  underlyingTokens: string[]
  underlyingTokensSymbol: string[]
}

async function getSwapInfo(swapAddress: string): Promise<SwapInfo> {
  console.log("----- get swap info -----")
  let swapContract = new ethers.Contract(swapAddress, abi, provider)
  let META_POOL = await swapContract.META_POOL()
  let BASE_POOL = await swapContract.BASE_POOL()
  let balances = await getBalances(swapAddress)

  let N_COINS = await swapContract.N_COINS()
  let N_STABLECOINS = await swapContract.N_STABLECOINS()
  let N_UL_COINS = await swapContract.N_UL_COINS()

  let metaTokens = []
  let baseTokens = []
  let underlyingTokens = []
  let metaTokensSymbol = []
  let baseTokensSymbol = []
  let underlyingTokensSymbol = []

  for (let i = 0; i < N_COINS; i++) {
    let t = await swapContract.metaTokens(i)
    let tokenContract = new ethers.Contract(t, erc20ABI, provider)
    let symbol = await tokenContract.symbol()
    metaTokensSymbol.push(symbol)
    metaTokens.push(t)
  }

  for (let i = 0; i < N_STABLECOINS; i++) {
    let t = await swapContract.baseTokens(i)
    let tokenContract = new ethers.Contract(t, erc20ABI, provider)
    let symbol = await tokenContract.symbol()
    baseTokensSymbol.push(symbol)
    baseTokens.push(t)
  }

  for (let i = 0; i < N_UL_COINS; i++) {
    let t = await swapContract.UNDERLYING_COINS(i)
    let tokenContract = new ethers.Contract(t, erc20ABI, provider)
    let symbol = await tokenContract.symbol()
    underlyingTokensSymbol.push(symbol)
    underlyingTokens.push(t)
  }

  return {
    basePool: BASE_POOL,
    metaPool: META_POOL,
    balances,
    tokens: metaTokens,
    tokensSymbol: metaTokensSymbol,
    baseTokens,
    baseTokensSymbol,
    underlyingTokens,
    underlyingTokensSymbol,
  }
}

async function registerTokens(list: string[], ctx: EvmLogHandlerContext): Promise<string[]> {
  let result: string[] = []

  for (let i = 0; i < list.length; ++i) {
    let current = list[i]
    let token = await getOrCreateToken(current, ctx)
    result.push(token.id)
  }

  return result
}

export async function getOrCreateToken(address: string, ctx: EvmLogHandlerContext): Promise<Token> {
  let token = await ctx.store.get(Token, address)

  if (token == null) {
    console.log("----- creating token -----")
    let tokenContract = new ethers.Contract(address, erc20ABI, provider)
    let name = await tokenContract.name()
    let symbol = await tokenContract.symbol()
    let decimals = await tokenContract.decimals()

    token = new Token({
      id: address,
      address: address,
      name: name,
      symbol: symbol,
      decimals: decimals
    }) 
    await ctx.store.save(token);
  }

  return assertNotNull(token);
}

export async function getDailyTradeVolume(
  swap: string,
  timestamp: BigInt,
  ctx: EvmLogHandlerContext
): Promise<DailyVolume> {
  let interval = BigInt(60 * 60 * 24 * 1000).valueOf()
  let day = timestamp.valueOf() / interval * interval
  let id = swap + "-day-" + day.toString()
  let volume = await ctx.store.get(DailyVolume, id)

  if (volume == null) {
    volume = new DailyVolume({
      id,
      swap: await ctx.store.get(Swap, swap),
      timestamp: timestamp.valueOf(),
      volume: BigInt(0)
    })
    await ctx.store.save(volume)
  }
  return assertNotNull(volume)
}

export async function getDailyPoolTvl(
  swap: string,
  timestamp: BigInt,
  ctx: EvmLogHandlerContext
): Promise<DailyTvl> {
  let interval = BigInt(60 * 60 * 24 * 1000).valueOf()
  let day = timestamp.valueOf() / interval * interval
  let id = swap + "-day-" + day.toString()
  let tvl = await ctx.store.get(DailyTvl, id)

  if (tvl == null) {
    tvl = new DailyTvl({
      id,
      swap: await ctx.store.get(Swap, swap),
      timestamp: timestamp.valueOf(),
      tvl: BigInt(0)
    })
    await ctx.store.save(tvl)
  }
  return assertNotNull(tvl)
}