import {
  BlockTag,
  Provider,
  TransactionRequest,
} from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";

export function createProvider(): Provider {
  console.log("Wrapping a provider...");
  const provider = new ethers.providers.WebSocketProvider(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.RPC_NODE!
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalCall = provider.call;
  // eslint-disable-next-line func-names
  provider.call = function (
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ) {
    console.log("With retrying....");
    return retry(async () =>
      timeout(originalCall.call(provider, transaction, blockTag))
    );
  };

  provider.on("error", console.error);

  return provider;
}

export async function timeout<T>(res: Promise<T>, seconds = 30): Promise<T> {
  return new Promise((resolve, reject) => {
    let timer: any = setTimeout(() => {
      timer = undefined;
      reject(new Error(`Request timed out in ${seconds} seconds`));
    }, seconds * 1000);

    res
      .finally(() => {
        if (timer != null) {
          clearTimeout(timer);
        }
      })
      .then(resolve, reject);
  });
}

export async function retry<T>(
  promiseFn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < attempts; i++) {
    try {
      return await promiseFn();
      // eslint-disable-next-line id-length
    } catch (e) {
      console.log(e);
    }
  }
  throw new Error(`Error after ${attempts} attempts`);
}
