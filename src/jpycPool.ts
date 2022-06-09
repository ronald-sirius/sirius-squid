import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Swap, DailyTvl, Token, DailyVolume } from "./model";
import { events, abi } from "./abi/XSwapDeposit"
import { abi as erc20ABI } from "./abi/ERC20"
import { abi as BasePoolABI} from "./abi/SwapNormal"
import { stopCoverage } from "v8";

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
const provider = new ethers.providers.WebSocketProvider(CHAIN_NODE);
const JPYC_ADDRESS = "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB";

export async function handleSwap(ctx: EvmLogHandlerContext): Promise<void> {
  console.log('==== find swap ====')
  const swapEvents = events["TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"].decode(ctx);
  let buyer = swapEvents.buyer
  let soldId = swapEvents.soldId.toNumber()
  let tokensSold = swapEvents.tokensSold
  let boughtId = swapEvents.boughtId.toNumber()
  let tokensBought = swapEvents.tokensBought
  let price = swapEvents.price
  let jpycPrice = Number(ethers.utils.formatUnits(price, 18))
  let swap = await getOrCreateSwap(ctx)
  let balances = await getBalances(swap.address)
  swap.balances = balances // update balances
  console.log("jpyc price:", jpycPrice)

  if (swap != null) {
    { 
      // update daily volume
      let tokens = swap.underlyingTokens
      if (soldId < tokens.length && boughtId < tokens.length) {
        let soldToken = await getOrCreateToken(tokens[soldId], ctx)
        console.log(`soldToken is ${soldToken.name}`)
        let boughtToken = await getOrCreateToken(tokens[boughtId], ctx)
        console.log(`boughtToken is ${boughtToken.name}`)
        let sellVolume = Number(ethers.utils.formatUnits(tokensSold, soldToken.decimals))
        let boughtVolume = Number(ethers.utils.formatUnits(tokensBought, boughtToken.decimals))
  
        if (tokens[boughtId] == JPYC_ADDRESS) {
          sellVolume = sellVolume * jpycPrice
        }
        if (tokens[soldId] == JPYC_ADDRESS) {
          boughtVolume = boughtVolume * jpycPrice
        }
        console.log("sellVolume:", sellVolume)
        console.log("boughtVolume:", boughtVolume)
        let volume = (sellVolume + boughtVolume) / 2
        console.log("volume:", volume)
        let dailyVolume = await getDailyTradeVolume(swap.id, BigInt(ctx.substrate.block.timestamp), ctx)
        dailyVolume.volume = dailyVolume.volume + BigInt(Math.floor(volume))
        console.log("dailyVolume:", dailyVolume.volume)
        await ctx.store.save(dailyVolume)
      }
    }

    {
      // update TVL and daily TVL
      let tvl = 0
      let tokens =swap.tokens
      for (let i = 0; i < tokens.length; i++) {
        let token = await getOrCreateToken(tokens[i], ctx)
        let decimals = token.decimals
        let balance = balances[i]
        let balanceDivDecimals = ethers.utils.formatUnits(balance, decimals)
        console.log('balanceDivDecimals:', balanceDivDecimals)
        if (token.address == JPYC_ADDRESS) {
          console.log(`token is jpyc`)
          let tokenTVL = Number(balanceDivDecimals) / jpycPrice
          // let tokenTVL = BigNumber.from(balanceDivDecimals).mul(BigNumber.from(1 / jpycPrice))
          console.log(`jpyc tokenTVL: ${tokenTVL}`)
          tvl = tvl + tokenTVL
        } else {
          tvl = tvl + Number(balanceDivDecimals)
        }
        tvl = Math.floor(tvl)
        console.log(`tvl ${tvl}`)
      }
      swap.tvl = BigInt(tvl)

      let dailyTvl = await getDailyPoolTvl(swap.address, BigInt(ctx.substrate.block.timestamp), ctx)
      dailyTvl.tvl = BigInt(tvl)
      await ctx.store.save(dailyTvl)
    }

    await ctx.store.save(swap)
  }
}

export async function getOrCreateSwap(ctx: EvmLogHandlerContext): Promise<Swap> {
  let swap = await ctx.store.get(Swap, ctx.contractAddress)
  let info = await getSwapInfo(ctx.contractAddress)
  if (swap == null) {
    swap = new Swap({
      id: ctx.contractAddress,
      address: ctx.contractAddress,
      tokens: await registerTokens(info.tokens, ctx),
      baseTokens: await registerTokens(info.baseTokens, ctx),
      underlyingTokens: await registerTokens(info.underlyingTokens, ctx),
      balances: info.balances,
      tvl: 0n,
    })
  }
  await ctx.store.save(swap);
  return assertNotNull(swap);
}

async function getBalances(swapAddress: string): Promise<bigint[]> {
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
  baseTokens: string[]
  underlyingTokens: string[]
}

async function getSwapInfo(swapAddress: string): Promise<SwapInfo> {
  let swapContract = new ethers.Contract(swapAddress, abi, provider)
  let META_POOL = await swapContract.META_POOL()
  let BASE_POOL = await swapContract.BASE_POOL()
  let balances = await getBalances(swapAddress)

  let N_COINS = await swapContract.N_COINS()
  let N_STABLECOINS = await swapContract.N_STABLECOINS()
  let N_UL_COINS = await swapContract.N_UL_COINS()

  let baseTokens = []
  let metaTokens = []
  let underlyingTokens = []

  for (let i = 0; i < N_COINS; i++) {
    let t = await swapContract.metaTokens(i)
    metaTokens.push(t)
  }

  for (let i = 0; i < N_STABLECOINS; i++) {
    let t = await swapContract.baseTokens(i)
    baseTokens.push(t)
  }

  for (let i = 0; i < N_UL_COINS; i++) {
    let t = await swapContract.UNDERLYING_COINS(i)
    underlyingTokens.push(t)
  }

  return {
    basePool: BASE_POOL,
    metaPool: META_POOL,
    balances,
    tokens: metaTokens,
    baseTokens,
    underlyingTokens,
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
  let tokenContract = new ethers.Contract(address, erc20ABI, provider)
  let name = await tokenContract.name()
  let symbol = await tokenContract.symbol()
  let decimals = await tokenContract.decimals()

  if (token == null) {
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
