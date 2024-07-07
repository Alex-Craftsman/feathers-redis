// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { RedisClientType } from 'redis';

import type {
  Id,
  NullableId,
  Params,
  ServiceInterface,
} from '@feathersjs/feathers';

import type { Application } from '@feathersjs/feathers';

import type { Cache, CacheData, CachePatch, CacheQuery } from './cache.schema';

export type { Cache, CacheData, CachePatch, CacheQuery };

export interface CacheServiceOptions {
  app: Application;
}

export interface CacheParams extends Params<CacheQuery> {}

export class CacheService<ServiceParams extends CacheParams = CacheParams>
  implements ServiceInterface<Cache, CacheData, ServiceParams, CachePatch>
{
  client: RedisClientType | undefined;

  constructor(public options: CacheServiceOptions) {
    this.client = options.app.get('redisClient') as RedisClientType | undefined;
  }

  async find(_params?: ServiceParams): Promise<Cache[]> {
    if (!this.client) {
      return Promise.resolve([]);
    }

    // TODO: Implement a better pagination mechanism
    const scanIterator = this.client.scanIterator({
      TYPE: 'string', // `SCAN` only
      MATCH: '*',
      COUNT: 100,
    });

    const ret: Cache[] = [];

    for await (const key of scanIterator) {
      // use the key!
      const v = await this.client.get(key);

      if (v) {
        ret.push({
          id: key,
          value: JSON.parse(v),
        });
      } else {
        ret.push({
          id: key,
          value: v,
        });
      }
    }

    return ret;
  }

  async get(id: Id, _params?: ServiceParams): Promise<Cache> {
    if (!this.client) {
      return {
        id: 'get',
        value: `A new message with ID: ${id.toString()}!`,
      };
    }

    const v = await this.client.get(id.toString());

    if (v) {
      return {
        id: id.toString(),
        value: JSON.parse(v),
      };
    }

    return {
      id: id.toString(),
      value: v,
    };
  }

  async create(data: CacheData, params?: ServiceParams): Promise<Cache>;
  async create(data: CacheData[], params?: ServiceParams): Promise<Cache[]>;
  async create(
    data: CacheData | CacheData[],
    params?: ServiceParams,
  ): Promise<Cache | Cache[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    throw new Error('NOT_IMPLEMENTED');
  }

  // This method has to be added to the 'methods' option to make it available to clients
  update(
    _id: NullableId,
    _data: CacheData,
    _params?: ServiceParams,
  ): Promise<Cache> {
    throw new Error('NOT_IMPLEMENTED');
  }

  patch(
    _id: NullableId,
    _data: CachePatch,
    _params?: ServiceParams,
  ): Promise<Cache> {
    throw new Error('NOT_IMPLEMENTED');
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Cache> {
    if (!this.client) {
      return Promise.resolve({
        id: 'remove',
        value: 'client is missing',
      });
    }

    if (!id) {
      await this.client.flushAll();
    } else {
      await this.client.del(id.toString());
    }

    return Promise.resolve({
      id: 'remove',
      value: 'removed',
    });
  }
}

export const getOptions = (app: Application) => {
  return { app };
};
