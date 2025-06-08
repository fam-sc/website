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
    path: string,
    body: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob
  ) {
    this.ops.push({
      run: () => {
        return this.bucket.put(path, body);
      },
      revert: () => {
        return this.bucket.delete(path);
      },
    });
  }

  async commit() {
    await Promise.all(this.ops.map((op) => op.run()));

    this.runSucessful = true;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this.runSucessful) {
      await Promise.all(this.ops.map((op) => op.revert()));
    }
  }
}
