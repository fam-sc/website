import { MediaFilePath } from '.';

type TransactionOperation = {
  run: () => Promise<unknown>;
  revert: () => Promise<unknown>;
};

export class MediaTransaction implements AsyncDisposable {
  private ops: TransactionOperation[] = [];
  private runSucessful: boolean = false;
  private bucket: R2Bucket;

  constructor(bucket: R2Bucket) {
    this.bucket = bucket;
  }

  put(
    path: MediaFilePath,
    body: ReadableStream | ArrayBuffer | ArrayBufferView | string | null,
    options?: R2PutOptions
  ) {
    this.ops.push({
      run: () => {
        return this.bucket.put(path, body, options);
      },
      revert: () => {
        return this.bucket.delete(path);
      },
    });
  }

  async commit() {
    console.log('commit');
    await Promise.all(this.ops.map((op) => op.run()));

    this.runSucessful = true;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this.runSucessful) {
      await Promise.all(this.ops.map((op) => op.revert()));
    }
  }
}
