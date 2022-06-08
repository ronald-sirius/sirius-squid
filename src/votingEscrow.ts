import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Lock, LockSystemInfo } from "./model";
import { events, abi } from "./abi/VotingEscrow"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";

export const contract = new ethers.Contract(
  "0xc9D383f1e6E5270D77ad8e198729e237b60b6397",
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export async function getOrCreateLock(ctx: EvmLogHandlerContext, userAddress: string): Promise<Lock> {
  let lock = await ctx.store.get(Lock, userAddress);
  if (lock == null) {
    lock = new Lock({
      id: userAddress,
      address: userAddress,
      amount: 0n,
      end: 0n,
    })
    await ctx.store.save(lock);
  }
  return assertNotNull(lock);
}

export async function getOrCreateLockSystemInfo(ctx: EvmLogHandlerContext): Promise<LockSystemInfo> {
  let info = await ctx.store.get(LockSystemInfo, "current");
  if (info == null) {
    info = new LockSystemInfo({
      id: "current",
      lockCount: 0n,
      averageLockTime: 0n,
    })
  }
  info.updated = BigInt(ctx.substrate.block.timestamp);
  info.updatedAtBlock = ctx.substrate.block.height;
  info.updatedAtTransaction = ctx.txHash;
  await ctx.store.save(info);
  return assertNotNull(info);
}

export async function processDeposit(ctx: EvmLogHandlerContext): Promise<void> {
  const depositEvent = events["Deposit(address,uint256,uint256,int128,uint256)"].decode(ctx);
  let endTime = depositEvent.locktime;
  let beginTime = depositEvent.ts;
  if (endTime != BigNumber.from(0) && endTime > beginTime) {
    let lockSystemInfo = await getOrCreateLockSystemInfo(ctx);
    let oldCount = lockSystemInfo.lockCount;
    let oldAverage = lockSystemInfo.averageLockTime;
    let oldTotal = oldCount * oldAverage;

    let lockDuration = endTime.sub(beginTime);
    let newTotal = oldTotal + lockDuration.toBigInt();
    let newCount = oldCount + 1n;
    let newAverage = newTotal / newCount;
    lockSystemInfo.lockCount = newCount;
    lockSystemInfo.averageLockTime = newAverage;
    ctx.store.save(lockSystemInfo);
  }
}