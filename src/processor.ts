// src/processor.ts
import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import * as VotingEscrowABI from "./abi/VotingEscrow";
import * as VotingEscrow from "./votingEscrow";
import * as XSwapDepositABI from "./abi/XSwapDeposit";
import * as jpycPool from "./jpycPool";
import * as ERC20ABI from "./abi/ERC20"
import * as SwapNormalABI from "./abi/SwapNormal"

const processor = new SubstrateEvmProcessor("astar-substrate");

processor.setBatchSize(500);

processor.setDataSource({
  chain: VotingEscrow.CHAIN_NODE,
  archive: lookupArchive("astar")[0].url,
});

processor.setTypesBundle("astar");

// processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
//   await ctx.store.save(createContractEntity());
// });

processor.addEvmLogHandler(
  "0xc9D383f1e6E5270D77ad8e198729e237b60b6397".toLowerCase(),
  {
    filter: [VotingEscrowABI.events["Deposit(address,uint256,uint256,int128,uint256)"].topic],
    range: { from: 1038952 }
  },
  VotingEscrow.processDeposit
)

processor.addEvmLogHandler(
  "0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c".toLowerCase(),
  {
    filter: [XSwapDepositABI.events["TokenExchange(address,uint256,uint256,uint256,uint256,uint256)"].topic],
    range: { from: 1147515 }
  },
  jpycPool.handleSwap
)

processor.run()