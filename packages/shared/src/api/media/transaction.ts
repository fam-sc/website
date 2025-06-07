import { deleteMediaFile, putMediaFile } from '.';

type TransactionOperation = {
  run: () => Promise<void>;
  revert: () => Promise<void>;
};

export class MediaTransaction implements AsyncDisposable {
  private ops: TransactionOperation[] = [];
  private runSucessful: boolean = false;

  put(path: string, body: BodyInit) {
    this.ops.push({
      run: () => {
        return putMediaFile(path, body);
      },
      revert: () => {
        return deleteMediaFile(path);
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
