import knex, { Knex } from 'knex';

import { AnswerOptionRepository } from './repos/option';
import { ReceptacleRepository } from './repos/receptacle';
import { StepRepository } from './repos/steps';

import { getEnvChecked } from '@/utils/env';

export class BotRepository {
  private knex: Knex;

  options: AnswerOptionRepository;
  receptacles: ReceptacleRepository;
  steps: StepRepository;

  constructor(knex: Knex) {
    this.knex = knex;

    this.options = new AnswerOptionRepository(knex);
    this.receptacles = new ReceptacleRepository(knex);
    this.steps = new StepRepository(knex);
  }

  transaction<R>(block: (repo: BotRepository) => Promise<R>): Promise<R> {
    return this.knex.transaction((trx) => block(new BotRepository(trx)));
  }

  static createConnection(): BotRepository {
    const database = knex({
      client: 'mssql',
      connection: {
        server: getEnvChecked('DB_SERVER'),
        port: Number.parseInt(getEnvChecked('DB_PORT')),
        database: getEnvChecked('DB_NAME'),
        user: getEnvChecked('DB_USER'),
        password: getEnvChecked('DB_PSWD'),
      },
    });

    return new BotRepository(database);
  }
}
