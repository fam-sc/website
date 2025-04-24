import { UpdateTimeType } from './types/meta';
import { Repository } from './repo';

export abstract class CachedExternalApi<T extends object, F = T> {
  private collection: UpdateTimeType;
  private invalidateTime: number;

  constructor(collection: UpdateTimeType, invalidateTime: number) {
    this.collection = collection;
    this.invalidateTime = invalidateTime;
  }

  async fetch(): Promise<T> {
    await using repo = await Repository.openConnection();
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
  }

  protected abstract fetchFromRepo(repo: Repository): Promise<T | null>;
  protected abstract fetchFromExternalApi(): Promise<F>;
  protected abstract putToRepo(repo: Repository, value: F): Promise<void>;

  protected mapFetchResult(value: F): T {
    return value as unknown as T;
  }

  static accessor<Args extends unknown[], T extends object, F>(
    implementation: new (...args: Args) => CachedExternalApi<T, F>
  ) {
    return (...args: Args) => {
      return new implementation(...args).fetch();
    };
  }
}
