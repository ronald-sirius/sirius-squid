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

// for pkex
import * as PoolsABI from "./abi/Pools";
import * as PoolsTierABI from "./abi/PoolsTier";
import * as FarmsABI from "./abi/Farms";
import * as pkexStake from "./pkexStake";
// pkex pools
const PKEX_PKEX_DEPOSIT = "0xC8f9d27B4e5E9c956c7344C87D2eF05381D89Fc9";
const DOT_PKEX_DEPOSIT = "0x8986CD046741CBfEe8F36a1dCD2af7C2a4942F1A";
const PKEX_PKEX2_DEPOSIT = "0x81e92630B409Fc1A593853B1f35115C7d7E6F0bc";
// pkex farms
const ASTR_PKEX_STAKE = "0x9F519083A069Cee2585cB4931C77C6EA21c3517E";
const ASTR_USDC_STAKE = "0x228a56F238F5441B1469B3bc6F64ddd362a3a0AF";
const USDC_USDT_STAKE = "0x367545a43B89A81d1a3816F13505cC7bB840c1f6";
const PKEX_USDC_STAKE = "0x34f0DB653A0CF8487D942223e5C347f3a2526039";
const PKEX_DOT_STAKE = "0x6B44EF63fe77C56478a191bC1673E24e0408a780";

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

// TODO change rangeFrom
processor.addEvmLogHandler(
  PKEX_PKEX_DEPOSIT.toLowerCase(),
  {
    filter: [PoolsABI.events['Stake(address,uint256)'].topic],
    range: { from: 251038 }
  },
  pkexStake.handlePoolDeposit
)
processor.addEvmLogHandler(
  DOT_PKEX_DEPOSIT.toLowerCase(),
  {
    filter: [PoolsABI.events['Stake(address,uint256)'].topic],
    range: { from: 1156055 }
  },
  pkexStake.handlePoolDeposit
)
processor.addEvmLogHandler(
  PKEX_PKEX2_DEPOSIT.toLowerCase(),
  {
    filter: [PoolsTierABI.events['Stake(address,uint256)'].topic],
    range: { from: 385556 }
  },
  pkexStake.handlePoolTierDeposit
)
processor.addEvmLogHandler(
  ASTR_PKEX_STAKE.toLowerCase(),
  {
    filter: [FarmsABI.events['Staked(address,uint256,uint256,uint256)'].topic],
    range: { from: 250937 }
  },
  pkexStake.handleFarmStake
)
processor.addEvmLogHandler(
  ASTR_USDC_STAKE.toLowerCase(),
  {
    filter: [FarmsABI.events['Staked(address,uint256,uint256,uint256)'].topic],
    range: { from: 250947 }
  },
  pkexStake.handleFarmStake
)
processor.addEvmLogHandler(
  USDC_USDT_STAKE.toLowerCase(),
  {
    filter: [FarmsABI.events['Staked(address,uint256,uint256,uint256)'].topic],
    range: { from: 250976 }
  },
  pkexStake.handleFarmStake
)
processor.addEvmLogHandler(
  PKEX_USDC_STAKE.toLowerCase(),
  {
    filter: [FarmsABI.events['Staked(address,uint256,uint256,uint256)'].topic],
    range: { from: 277767 }
  },
  pkexStake.handleFarmStake
)
processor.addEvmLogHandler(
  PKEX_DOT_STAKE.toLowerCase(),
  {
    filter: [FarmsABI.events['Staked(address,uint256,uint256,uint256)'].topic],
    range: { from: 1155918 }
  },
  pkexStake.handleFarmStake
)

processor.run();
