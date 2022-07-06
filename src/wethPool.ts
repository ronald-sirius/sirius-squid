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

const WETH_ADDRESS = "0x81ecac0d6be0550a00ff064a4f9dd2400585fe9c";

export async function handleSwap(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("\n==== find WETH swap ====");
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
  const wethPrice = Number(ethers.utils.formatUnits(price, 18));
  const swap = await getOrCreateSwap(ctx);
  const balances = await getBalances(swap.address);
  swap.balances = balances; // update balances
  console.log("weth price:", wethPrice);
  console.log("real weth price:", 1 / wethPrice);

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

        if (tokens[boughtId] === WETH_ADDRESS) {
          sellVolume *= wethPrice;
        }
        if (tokens[soldId] === WETH_ADDRESS) {
          boughtVolume *= wethPrice;
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
        if (token.address === WETH_ADDRESS) {
          const tokenTVL = Number(balanceDivDecimals) / wethPrice;
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
