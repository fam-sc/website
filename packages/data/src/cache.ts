import { UpdateTimeType } from './types/meta';
import { Repository } from './repo';
import { DataQuery } from './sqlite/query';
import { isPromise } from '@shared/typecheck';

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

  async fetchValue(): Promise<T> {
    let repo = this.specRepo;

    if (repo === undefined) {
      repo = Repository.openConnection();
    }

    const fetchFromRepoAction = this.fetchFromRepo(repo);

    let result: T | null = null;

    if (isPromise(fetchFromRepoAction)) {
      const fetchTimePromise = repo.updateTime().getByType(this.collection);
      const anyResult = await Promise.race([
        fetchTimePromise,
        fetchFromRepoAction,
      ]);

      if (typeof anyResult === 'number') {
        if (Date.now() - anyResult < this.invalidateTime) {
          result = await fetchFromRepoAction;
        }
      } else {
        const lastUpdateTime = await fetchTimePromise;

        if (Date.now() - lastUpdateTime < this.invalidateTime) {
          result = anyResult;
        }
      }
    } else {
      const [fetchTime, repoResult] = await repo.batch([
        repo.updateTime().getByTypeAction(this.collection),
        fetchFromRepoAction,
      ]);

      if (Date.now() - fetchTime < this.invalidateTime) {
        result = repoResult;
      }
    }

    if (result !== null) {
      return result;
    }

    const fetchValue = await this.fetchFromExternalApi();
    const putAction = this.putToRepo(repo, fetchValue);

    const setTimeAction = repo
      .updateTime()
      .setByType(this.collection, Date.now());

    await (isPromise(putAction)
      ? Promise.all([putAction, setTimeAction.get()])
      : repo.batch([...putAction, setTimeAction]));

    return this.mapFetchResult(fetchValue);
  }

  protected abstract fetchFromRepo(
    repo: Repository
  ): Promise<T | null> | DataQuery<T | null>;

  protected abstract fetchFromExternalApi(): Promise<F>;

  protected abstract putToRepo(
    repo: Repository,
    value: F
  ): Promise<void> | DataQuery<unknown>[];

  protected mapFetchResult(value: F): T {
    return value as unknown as T;
  }

  static accessor<Args extends unknown[], T, F>(
    implementation: new (...args: Args) => CachedExternalApi<T, F>
  ) {
    return (...args: Args) => {
      return new implementation(...args).fetchValue();
    };
  }
}
