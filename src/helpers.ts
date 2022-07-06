/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
import {
  assertNotNull,
  EvmLogHandlerContext,
} from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Swap, DailyTvl, Token, DailyVolume } from "./model";
import { abi } from "./abi/XSwapDeposit";
import { abi as erc20ABI } from "./abi/ERC20";
import { createProvider } from "./libs/utils";

const provider = createProvider();

export async function getOrCreateSwap(
  ctx: EvmLogHandlerContext
): Promise<Swap> {
  let swap = await ctx.store.get(Swap, ctx.contractAddress);
  if (swap == null) {
    const info = await getSwapInfo(ctx.contractAddress);
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
    });
  }
  await ctx.store.save(swap);
  return assertNotNull(swap);
}

export async function getBalances(swapAddress: string): Promise<bigint[]> {
  const swapContract = new ethers.Contract(swapAddress, abi, provider);
  const N_COINS = await swapContract.N_COINS();
  const META_POOL = await swapContract.META_POOL();
  const BASE_POOL = await swapContract.BASE_POOL();
  const balances = new Array<bigint>(N_COINS);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < N_COINS; ++i) {
    const token = await swapContract.UNDERLYING_COINS(i);
    const tokenContract = new ethers.Contract(token, erc20ABI, provider);
    let b: BigNumber;
    if (i === N_COINS - 1) {
      b = await tokenContract.balanceOf(BASE_POOL);
    } else {
      b = await tokenContract.balanceOf(META_POOL);
    }
    balances[i] = b.toBigInt().valueOf();
  }
  return balances;
}

class SwapInfo {
  basePool: string;

  metaPool: string;

  balances: bigint[];

  tokens: string[];

  tokensSymbol: string[];

  baseTokens: string[];

  baseTokensSymbol: string[];

  underlyingTokens: string[];

  underlyingTokensSymbol: string[];
}

async function getSwapInfo(swapAddress: string): Promise<SwapInfo> {
  console.log("----- get swap info -----");
  const swapContract = new ethers.Contract(swapAddress, abi, provider);
  const META_POOL = await swapContract.META_POOL();
  const BASE_POOL = await swapContract.BASE_POOL();
  const balances = await getBalances(swapAddress);

  const N_COINS = await swapContract.N_COINS();
  const N_STABLECOINS = await swapContract.N_STABLECOINS();
  const N_UL_COINS = await swapContract.N_UL_COINS();

  const metaTokens = [];
  const baseTokens = [];
  const underlyingTokens = [];
  const metaTokensSymbol = [];
  const baseTokensSymbol = [];
  const underlyingTokensSymbol = [];

  for (let i = 0; i < N_COINS; i++) {
    const t = await swapContract.metaTokens(i);
    const tokenContract = new ethers.Contract(t, erc20ABI, provider);
    const symbol = await tokenContract.symbol();
    metaTokensSymbol.push(symbol);
    metaTokens.push(t);
  }

  for (let i = 0; i < N_STABLECOINS; i++) {
    const t = await swapContract.baseTokens(i);
    const tokenContract = new ethers.Contract(t, erc20ABI, provider);
    const symbol = await tokenContract.symbol();
    baseTokensSymbol.push(symbol);
    baseTokens.push(t);
  }

  for (let i = 0; i < N_UL_COINS; i++) {
    const t = await swapContract.UNDERLYING_COINS(i);
    const tokenContract = new ethers.Contract(t, erc20ABI, provider);
    const symbol = await tokenContract.symbol();
    underlyingTokensSymbol.push(symbol);
    underlyingTokens.push(t);
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
  };
}

async function registerTokens(
  list: string[],
  ctx: EvmLogHandlerContext
): Promise<string[]> {
  const result: string[] = [];

  for (let i = 0; i < list.length; ++i) {
    const current = list[i];
    const token = await getOrCreateToken(current, ctx);
    result.push(token.id);
  }

  return result;
}

export async function getOrCreateToken(
  address: string,
  ctx: EvmLogHandlerContext
): Promise<Token> {
  let token = await ctx.store.get(Token, address);

  if (token == null) {
    console.log("----- creating token -----");
    const tokenContract = new ethers.Contract(address, erc20ABI, provider);
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const decimals = await tokenContract.decimals();

    token = new Token({
      id: address,
      address,
      name,
      symbol,
      decimals,
    });
    await ctx.store.save(token);
  }

  return assertNotNull(token);
}

export async function getDailyTradeVolume(
  swap: string,
  timestamp: BigInt,
  ctx: EvmLogHandlerContext
): Promise<DailyVolume> {
  const interval = BigInt(60 * 60 * 24 * 1000).valueOf();
  const day = (timestamp.valueOf() / interval) * interval;
  const id = `${swap}-day-${day.toString()}`;
  let volume = await ctx.store.get(DailyVolume, id);

  if (volume == null) {
    volume = new DailyVolume({
      id,
      swap: await ctx.store.get(Swap, swap),
      timestamp: timestamp.valueOf(),
      volume: BigInt(0),
    });
    await ctx.store.save(volume);
  }
  return assertNotNull(volume);
}

export async function getDailyPoolTvl(
  swap: string,
  timestamp: BigInt,
  ctx: EvmLogHandlerContext
): Promise<DailyTvl> {
  const interval = BigInt(60 * 60 * 24 * 1000).valueOf();
  const day = (timestamp.valueOf() / interval) * interval;
  const id = `${swap}-day-${day.toString()}`;
  let tvl = await ctx.store.get(DailyTvl, id);

  if (tvl == null) {
    tvl = new DailyTvl({
      id,
      swap: await ctx.store.get(Swap, swap),
      timestamp: timestamp.valueOf(),
      tvl: BigInt(0),
    });
    await ctx.store.save(tvl);
  }
  return assertNotNull(tvl);
}
