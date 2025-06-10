import { Repository } from './repo';

export async function useRepo<R>(
  specRepo: Repository | undefined,
  block: (repo: Repository) => Promise<R>
): Promise<void> {
  let repo = specRepo;
  if (repo === undefined) {
    repo = await Repository.openConnection();
  }

  try {
    await block(repo);
  } finally {
    if (specRepo === undefined) {
      await repo[Symbol.asyncDispose]();
    }
  }
}
