import { UpdateTimeType } from './types/meta';
import { Repository } from './repo';

export abstract class CachedExternalApi<T, F = T> {
  private collection: UpdateTimeType;
  private invalidateTime: number;
  private specRepo: Repository | undefined;

  constructor(
    collection: UpdateTimeType,
    invalidateTime: number,
    repo?: Repository
  ) {
    this.collection = collection;
    this.invalidateTime = invalidateTime;
    this.specRepo = repo;
  }

  async fetch(): Promise<T> {
    let repo = this.specRepo;

    try {
      if (repo === undefined) {
        repo = await Repository.openConnection();
      }

      const fetchTimePromise = repo.updateTime().getByType(this.collection);
      const fetchFromRepoPromise = this.fetchFromRepo(repo);
      const anyResult = await Promise.race([
        fetchTimePromise,
        fetchFromRepoPromise,
      ]);

      let result: T | null = null;

      if (typeof anyResult === 'number') {
        if (Date.now() - anyResult < this.invalidateTime) {
          result = await fetchFromRepoPromise;
        }
      } else {
        const lastUpdateTime = await fetchTimePromise;

        if (Date.now() - lastUpdateTime < this.invalidateTime) {
          result = anyResult;
        }
      }

      if (result !== null) {
        return result;
      }

      const fetchResult = await this.fetchFromExternalApi();

      await Promise.all([
        this.putToRepo(repo, fetchResult),
        repo.updateTime().setByType(this.collection, Date.now()),
      ]);

      return this.mapFetchResult(fetchResult);
    } finally {
      if (this.specRepo === undefined) {
        await repo?.[Symbol.asyncDispose]();
      }
    }
  }

  protected abstract fetchFromRepo(repo: Repository): Promise<T | null>;
  protected abstract fetchFromExternalApi(): Promise<F>;
  protected abstract putToRepo(repo: Repository, value: F): Promise<void>;

  protected mapFetchResult(value: F): T {
    return value as unknown as T;
  }

  static accessor<Args extends unknown[], T, F>(
    implementation: new (...args: Args) => CachedExternalApi<T, F>
  ) {
    return (...args: Args) => {
      return new implementation(...args).fetch();
    };
  }
}
