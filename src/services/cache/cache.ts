// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema';

import type {
  Application,
} from '@feathersjs/feathers';

import { CacheService, getOptions } from './cache.class';
import {
  // cacheDataResolver,
  cacheDataValidator,
  // cacheExternalResolver,
  // cachePatchResolver,
  cachePatchValidator,
  // cacheQueryResolver,
  cacheQueryValidator,
  // cacheResolver,
} from './cache.schema';
import { cacheMethods, cachePath } from './cache.shared';

export * from './cache.class';
export * from './cache.schema';

// A configure function that registers the service and its hooks via `app.configure`
export const cache = (app: Application) => {
  // Register our service on the Feathers application
  app.use(cachePath, new CacheService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: cacheMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  });

  // Initialize hooks
  app.service(cachePath).hooks({
    around: {
      all: [
        // schemaHooks.resolveExternal(cacheExternalResolver),
        // schemaHooks.resolveResult(cacheResolver),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(cacheQueryValidator),
        // schemaHooks.resolveQuery(cacheQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(cacheDataValidator),
        // schemaHooks.resolveData(cacheDataResolver),
      ],
      patch: [
        schemaHooks.validateData(cachePatchValidator),
        // schemaHooks.resolveData(cachePatchResolver),
      ],
      remove: [],
    },
    after: {
      all: [],
    },
    error: {
      all: [],
    },
  });
};

// // Add this service to the service type index
// declare module '../../declarations' {
//   interface ServiceTypes {
//     [cachePath]: CacheService;
//   }
// }
