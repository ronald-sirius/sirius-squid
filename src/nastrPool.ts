import { EvmLogHandlerContext } from '@subsquid/substrate-evm-processor'
import { ethers } from 'ethers'
import { events, abi } from './abi/SwapNormal'
import { getOrCreateSwap, getBalances, getOrCreateToken, getDailyTradeVolume, getDailyPoolTvl } from './helpers'
import { createProvider } from './libs/utils'

const NASTR_ADDRESS = '0xE511ED88575C57767BAfb72BfD10775413E3F2b0'
export const NASTR_SWAP_ADDRESS = '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3'

const swapContract = new ethers.Contract(NASTR_SWAP_ADDRESS, abi, createProvider())

export async function handleTokenSwap(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("\n==== find NASTR swap ====");
  console.log(`at block: ${ctx.substrate.block.height}`);
  console.log(`at tx: ${ctx.txHash}`);
  const swapEvents = events['TokenSwap(address,uint256,uint256,uint128,uint128)'].decode(ctx)
  const { buyer, tokensSold, tokensBought } = swapEvents
  const soldId = swapEvents.soldId.toNumber()
  const boughtId = swapEvents.boughtId.toNumber()

  // TODO get price
  const nastrPrice = 1

  const swap = await getOrCreateSwap(ctx);
  const balances = await getBalances(swap.address);
  swap.balances = balances; // update balances
  console.log("nastr price:", nastrPrice);
  console.log("real nastr price:", 1 / nastrPrice);

  if (swap != null) {
    {
      // update daily volume
      const tokens = swap.underlyingTokens;
      if (soldId < tokens.length && boughtId < tokens.length) {
        const soldToken = await getOrCreateToken(tokens[soldId], ctx);
        console.log(`soldToken is ${soldToken.name}`);
        const boughtToken = await getOrCreateToken(tokens[boughtId], ctx);
        console.log(`boughtToken is ${boughtToken.name}`);
        let sellVolume = Number(
          ethers.utils.formatUnits(tokensSold, soldToken.decimals)
        );
        let boughtVolume = Number(
          ethers.utils.formatUnits(tokensBought, boughtToken.decimals)
        );

        if (tokens[boughtId] === NASTR_ADDRESS) {
          sellVolume *= nastrPrice;
        }
        if (tokens[soldId] === NASTR_ADDRESS) {
          boughtVolume *= nastrPrice;
        }
        console.log("sellVolume:", sellVolume);
        console.log("boughtVolume:", boughtVolume);
        const volume = (sellVolume + boughtVolume) / 2;
        console.log("volume:", volume);
        const dailyVolume = await getDailyTradeVolume(
          swap.id,
          BigInt(ctx.substrate.block.timestamp),
          ctx
        );
        dailyVolume.volume += BigInt(Math.floor(volume));
        await ctx.store.save(dailyVolume);
      }
    }

    {
      // update TVL and daily TVL
      let tvl = 0;
      const { tokens } = swap;
      for (let i = 0; i < tokens.length; i++) {
        const token = await getOrCreateToken(tokens[i], ctx);
        const { decimals } = token;
        const balance = balances[i];
        const balanceDivDecimals = ethers.utils.formatUnits(balance, decimals);
        if (token.address === NASTR_ADDRESS) {
          const tokenTVL = Number(balanceDivDecimals) / nastrPrice;
          tvl += tokenTVL;
        } else {
          tvl += Number(balanceDivDecimals);
        }
        tvl = Math.floor(tvl);
      }
      swap.tvl = BigInt(tvl);

      const dailyTvl = await getDailyPoolTvl(
        swap.address,
        BigInt(ctx.substrate.block.timestamp),
        ctx
      );
      dailyTvl.tvl = BigInt(tvl);
      await ctx.store.save(dailyTvl);
    }

    await ctx.store.save(swap);
  }
}
