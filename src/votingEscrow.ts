/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable import/extensions */
import {
  assertNotNull,
  EvmLogHandlerContext,
} from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Lock, LockSystemInfo, VeHolder } from "./model";
import { events, abi } from "./abi/VotingEscrow";
import { createProvider } from "./libs/utils";

export const contract = new ethers.Contract(
  "0xc9D383f1e6E5270D77ad8e198729e237b60b6397",
  abi,
  createProvider()
);

export async function getOrCreateLock(
  ctx: EvmLogHandlerContext,
  userAddress: string
): Promise<Lock> {
  let lock = await ctx.store.get(Lock, userAddress);
  if (lock == null) {
    lock = new Lock({
      id: userAddress,
      address: userAddress,
      amount: 0n,
      end: 0n,
    });
    await ctx.store.save(lock);
  }
  return assertNotNull(lock);
}

export async function getOrCreateLockSystemInfo(
  ctx: EvmLogHandlerContext
): Promise<LockSystemInfo> {
  let info = await ctx.store.get(LockSystemInfo, "current");
  if (info == null) {
    info = new LockSystemInfo({
      id: "current",
      lockCount: 0n,
      averageLockTime: 0n,
    });
  }
  info.updated = BigInt(ctx.substrate.block.timestamp);
  info.updatedAtBlock = ctx.substrate.block.height;
  info.updatedAtTransaction = ctx.txHash;
  await ctx.store.save(info);
  return assertNotNull(info);
}

export async function processDeposit(ctx: EvmLogHandlerContext): Promise<void> {
  const depositEvent =
    events["Deposit(address,uint256,uint256,int128,uint256)"].decode(ctx);
  const endTime = depositEvent.locktime;
  const beginTime = depositEvent.ts;
  if (endTime !== BigNumber.from(0) && endTime > beginTime) {
    const lockSystemInfo = await getOrCreateLockSystemInfo(ctx);
    const oldCount = lockSystemInfo.lockCount;
    const oldAverage = lockSystemInfo.averageLockTime;
    const oldTotal = oldCount * oldAverage;

    const lockDuration = endTime.sub(beginTime);
    const newTotal = oldTotal + lockDuration.toBigInt();
    const newCount = oldCount + 1n;
    const newAverage = newTotal / newCount;
    lockSystemInfo.lockCount = newCount;
    lockSystemInfo.averageLockTime = newAverage;
    // eslint-disable-next-line no-void
    void ctx.store.save(lockSystemInfo);
  }
}

export async function updateVeHolder(ctx: EvmLogHandlerContext): Promise<void> {
  const depositEvent =
    events["Deposit(address,uint256,uint256,int128,uint256)"].decode(ctx);
  const userAddress = depositEvent.provider;
  let user = await ctx.store.get(VeHolder, userAddress);
  if (user == null) {
    user = new VeHolder({
      id: userAddress,
      address: userAddress,
      updatedAt: BigInt(+new Date()).valueOf(),
    });
    await ctx.store.save(user);
  }
}
