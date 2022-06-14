import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { events } from "./abi/XSwapDeposit"
import { getOrCreateSwap, getBalances, getOrCreateToken, getDailyTradeVolume, getDailyPoolTvl } from "./helpers"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";
const WBNB_ADDRESS = "0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52";
const WBNB_DECIMALS = 18;

export async function handleSwap(ctx: EvmLogHandlerContext): Promise<void> {
  console.log('\n==== find WBNB swap ====')
  console.log(`at block: ${ctx.substrate.block.height}`)
  console.log(`at tx: ${ctx.txHash}`)
  const swapEvents = events["TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"].decode(ctx);
  let buyer = swapEvents.buyer
  let soldId = swapEvents.soldId.toNumber()
  let tokensSold = swapEvents.tokensSold
  let boughtId = swapEvents.boughtId.toNumber()
  let tokensBought = swapEvents.tokensBought
  let price = swapEvents.price
  let wbnbPrice = Number(ethers.utils.formatUnits(price, 18))
  let swap = await getOrCreateSwap(ctx)
  let balances = await getBalances(swap.address)
  swap.balances = balances // update balances
  console.log("wbnb price:", wbnbPrice)
  console.log("real wbnb price:", 1 / wbnbPrice)

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
  
        if (tokens[boughtId] == WBNB_ADDRESS) {
          sellVolume = sellVolume * wbnbPrice
        }
        if (tokens[soldId] == WBNB_ADDRESS) {
          boughtVolume = boughtVolume * wbnbPrice
        }
        console.log("sellVolume:", sellVolume)
        console.log("boughtVolume:", boughtVolume)
        let volume = (sellVolume + boughtVolume) / 2
        console.log("volume:", volume)
        let dailyVolume = await getDailyTradeVolume(swap.id, BigInt(ctx.substrate.block.timestamp), ctx)
        dailyVolume.volume = dailyVolume.volume + BigInt(Math.floor(volume))
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
        if (token.address == WBNB_ADDRESS) {
          let tokenTVL = Number(balanceDivDecimals) / wbnbPrice
          tvl = tvl + tokenTVL
        } else {
          tvl = tvl + Number(balanceDivDecimals)
        }
        tvl = Math.floor(tvl)
      }
      swap.tvl = BigInt(tvl)

      let dailyTvl = await getDailyPoolTvl(swap.address, BigInt(ctx.substrate.block.timestamp), ctx)
      dailyTvl.tvl = BigInt(tvl)
      await ctx.store.save(dailyTvl)
    }

    await ctx.store.save(swap)
  }
}


