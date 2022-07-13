import { EvmLogHandlerContext } from '@subsquid/substrate-evm-processor'
import { PkexStakeAcct } from './model'
import { events as PoolsEvents } from './abi/Pools'
import { events as PoolsTierEvents } from './abi/PoolsTier'
import { events as FarmsEvents } from './abi/Farms'

export async function updateStakeAcct(ctx: EvmLogHandlerContext, account: string): Promise<void> {
  let user = await ctx.store.get(PkexStakeAcct, account)
  if (user == null) {
    user = new PkexStakeAcct({
      id: account,
      address: account,
      lastActionTime: BigInt(+new Date()).valueOf() // TODO event time
    })
    await ctx.store.save(user)
  }
}

export async function handlePoolDeposit(ctx: EvmLogHandlerContext): Promise<void> {
  const depositEvent = PoolsEvents['Stake(address,uint256)'].decode(ctx)
  updateStakeAcct(ctx, depositEvent.who)
}
export async function handlePoolTierDeposit(ctx: EvmLogHandlerContext): Promise<void> {
  const depositEvent = PoolsTierEvents['Stake(address,uint256)'].decode(ctx)
  updateStakeAcct(ctx, depositEvent.who)
}
export async function handleFarmStake(ctx: EvmLogHandlerContext): Promise<void> {
  const stakeEvent = FarmsEvents['Staked(address,uint256,uint256,uint256)'].decode(ctx)
  updateStakeAcct(ctx, stakeEvent.user)
}
