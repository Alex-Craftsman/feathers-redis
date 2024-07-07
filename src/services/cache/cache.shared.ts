// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params, Application } from '@feathersjs/feathers';

import type {
  Cache,
  CacheData,
  CachePatch,
  CacheQuery,
  CacheService,
} from './cache.class';

export type { Cache, CacheData, CachePatch, CacheQuery };

export type CacheClientService = Pick<
  CacheService<Params<CacheQuery>>,
  (typeof cacheMethods)[number]
>;

export const cachePath = 'cache';

export const cacheMethods: (keyof CacheService)[] = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
];

export const cacheClient = (client: Application) => {
  const connection = client.get('connection');

  client.use(cachePath, connection.service(cachePath), {
    methods: cacheMethods,
  });
};

// // Add this service to the client service type index
// declare module '../../client' {
//   interface ServiceTypes {
//     [cachePath]: CacheClientService;
//   }
// }
