import * as redis from 'redis';
import chalk from 'chalk';

import { Application } from '@feathersjs/feathers';

export default function redisClient(app: Application) {
  const cacheOptions = app.get('redisCache') || {};

  const retryInterval = cacheOptions.retryInterval || 10000;

  const redisOptions = Object.assign({}, app.get('redis'), {
    retry_strategy: function (_options: unknown) {
      app.set('redisClient', undefined);

      if (cacheOptions.env !== 'test') {
        console.log(`${chalk.yellow('[redis]')} not connected`);
      }

      return retryInterval;
    }
  });

  const client = redis.createClient(redisOptions);

  client.connect();

  app.set('redisClient', client);

  client.on('ready', () => {
    app.set('redisClient', client);

    if (cacheOptions.env !== 'test') {
      console.log(`${chalk.green('[redis]')} connected`);
    }
  });
}
