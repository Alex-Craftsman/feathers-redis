import dayjs from './helpers/dayjs';
import chalk from 'chalk';
import { parsePath } from './helpers/path';
import type { HookContext } from '@feathersjs/feathers';

const defaults = {
  env: 'production',
  defaultDuration: 3600 * 24,
  immediateCacheKey: false
};

type RedisCacheOptions = {
  defaultDuration: number;
  parseNestedRoutes: boolean;
  removePathFromCacheKey: boolean;
  immediateCacheKey: boolean;
  env: string,
};

export function before(options?: RedisCacheOptions) {
  return function (hook: HookContext): Promise<HookContext> {
    const cacheOptions = hook.app.get('redisCache');

    const opts = Object.assign({}, defaults, cacheOptions, options);

    return new Promise(async (resolve, reject) => {
      const client = hook.app.get('redisClient');

      if (!client) {
        resolve(hook);
      }

      const path = parsePath(hook, options);

      const reply: string | null = await client.get(path).catch((err: unknown) => reject(err));

      try {
        if (reply) {
          let data = JSON.parse(reply);

          const duration = dayjs(data.cache.expiresOn).format('DD MMMM YYYY - HH:mm:ss');

          hook.result = data;

          resolve(hook);

          if (opts.env !== 'test') {
            console.log(`${chalk.cyan('[redis]')} returning cached value for ${chalk.green(path)}.`);
            console.log(`> Expires on ${duration}.`);
          }
        } else {
          if (opts.immediateCacheKey === true) {
            hook.params.cacheKey = path;
          }

          resolve(hook);
        }
      } catch (err) {
        reject(err);
      }
    });
  };
};

export function after(options?: RedisCacheOptions) { // eslint-disable-line no-unused-vars
  return function (hook: HookContext): Promise<HookContext> {
    const cacheOptions = hook.app.get('redisCache');

    const opts = Object.assign({}, defaults, cacheOptions, options);

    return new Promise(async (resolve, reject) => {
      try {
        if (!hook.result.cache?.cached) {
          const duration = hook.result.cache?.duration || opts.defaultDuration;
          const client = hook.app.get('redisClient');

          if (!client) {
            resolve(hook);
          }

          const path = hook.params.cacheKey || parsePath(hook, options);

          if (!hook.result.cache) {
            hook.result.cache = {};
          }

          // adding a cache object
          Object.assign(hook.result.cache, {
            cached: true,
            duration: duration,
            expiresOn: dayjs().add(dayjs.duration(duration, 'seconds')),
            parent: hook.path,
            group: hook.path ? `group-${hook.path}` : '',
            key: path
          });

          client.set(path, JSON.stringify(hook.result));
          client.expire(path, hook.result.cache.duration);

          if (opts.env !== 'test') {
            console.log(`${chalk.cyan('[redis]')} added ${chalk.green(path)} to the cache.`);
            console.log(`> Expires in ${dayjs.duration(duration, 'seconds').humanize()}.`);
          }
        }

        if (hook.result.cache.hasOwnProperty('wrapped')) {
          const { wrapped } = hook.result.cache;

          hook.result = wrapped;
        }

        resolve(hook);
      } catch (err) {
        reject(err);
      }
    });
  };
};

