// src/processor.ts
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
// eslint-disable-next-line import/extensions
import * as VotingEscrowABI from "./abi/VotingEscrow";
import * as VotingEscrow from "./votingEscrow";
// eslint-disable-next-line import/extensions
import * as XSwapDepositABI from "./abi/XSwapDeposit";
import * as jpycPool from "./jpycPool";
import * as wbnbPool from "./wbnbPool";
import * as wbtcPool from "./wbtcPool";
import * as wethPool from "./wethPool";

const processor = new SubstrateEvmProcessor("astar-substrate");

const JPYC_METAPOOL_DEPOSIT = "0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c";
const WBNB_METAPOOL_DEPOSIT = "0xC9d4f937Fa8e0193b46817a41435a262867ff090";
const WBTC_METAPOOL_DEPOSIT = "0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f";
const WETH_METAPOOL_DEPOSIT = "0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7";
const VE_TOKEN_ADDRESS = "0xc9D383f1e6E5270D77ad8e198729e237b60b6397";

const JPYC_START_BLOCK = 1147515;
const WBNB_START_BLOCK = 1230280;
const WBTC_START_BLOCK = 1230279;
const WETH_START_BLOCK = 1230280;

processor.setBatchSize(500);

processor.setDataSource({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  chain: process.env.RPC_NODE!,
  archive: lookupArchive("astar")[0].url,
});

processor.setTypesBundle("astar");

// processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
//   await ctx.store.save(createContractEntity());
// });

processor.addEvmLogHandler(
  VE_TOKEN_ADDRESS.toLowerCase(),
  {
    filter: [
      VotingEscrowABI.events["Deposit(address,uint256,uint256,int128,uint256)"]
        .topic,
    ],
    range: { from: 1038952 },
  },
  VotingEscrow.processDeposit
);

processor.addEvmLogHandler(
  VE_TOKEN_ADDRESS.toLowerCase(),
  {
    filter: [
      VotingEscrowABI.events["Deposit(address,uint256,uint256,int128,uint256)"]
        .topic,
    ],
    range: { from: 815184 },
  },
  VotingEscrow.updateVeHolder
);

processor.addEvmLogHandler(
  JPYC_METAPOOL_DEPOSIT.toLowerCase(),
  {
    filter: [
      XSwapDepositABI.events[
        "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"
      ].topic,
    ],
    range: { from: JPYC_START_BLOCK },
  },
  jpycPool.handleSwap
);

processor.addEvmLogHandler(
  WBNB_METAPOOL_DEPOSIT.toLowerCase(),
  {
    filter: [
      XSwapDepositABI.events[
        "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"
      ].topic,
    ],
    range: { from: WBNB_START_BLOCK },
  },
  wbnbPool.handleSwap
);

processor.addEvmLogHandler(
  WBTC_METAPOOL_DEPOSIT.toLowerCase(),
  {
    filter: [
      XSwapDepositABI.events[
        "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"
      ].topic,
    ],
    range: { from: WBTC_START_BLOCK },
  },
  wbtcPool.handleSwap
);

processor.addEvmLogHandler(
  WETH_METAPOOL_DEPOSIT.toLowerCase(),
  {
    filter: [
      XSwapDepositABI.events[
        "TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"
      ].topic,
    ],
    range: { from: WETH_START_BLOCK },
  },
  wethPool.handleSwap
);

processor.run();
