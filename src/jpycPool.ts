/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable import/extensions */
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { events } from "./abi/XSwapDeposit";
import {
  getOrCreateSwap,
  getBalances,
  getOrCreateToken,
  getDailyTradeVolume,
  getDailyPoolTvl,
} from "./helpers";

const JPYC_ADDRESS = "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB";

export async function handleSwap(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("\n==== find JPYC swap ====");
  console.log(`at block: ${ctx.substrate.block.height}`);
  console.log(`at tx: ${ctx.txHash}`);
  const swapEvents =
    events[
      "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"
    ].decode(ctx);
  const { buyer } = swapEvents;
  const soldId = swapEvents.soldId.toNumber();
  const { tokensSold } = swapEvents;
  const boughtId = swapEvents.boughtId.toNumber();
  const { tokensBought } = swapEvents;
  const { price } = swapEvents;
  const jpycPrice = Number(ethers.utils.formatUnits(price, 18));
  const swap = await getOrCreateSwap(ctx);
  const balances = await getBalances(swap.address);
  swap.balances = balances; // update balances
  console.log("jpyc price:", jpycPrice);
  console.log("real jpyc price:", 1 / jpycPrice);

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

        if (tokens[boughtId] === JPYC_ADDRESS) {
          sellVolume *= jpycPrice;
        }
        if (tokens[soldId] === JPYC_ADDRESS) {
          boughtVolume *= jpycPrice;
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
        if (token.address === JPYC_ADDRESS) {
          const tokenTVL = Number(balanceDivDecimals) / jpycPrice;
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
