import type { HookContext } from "@feathersjs/feathers";

/**
 * After hook - generates a cache object that is needed
 * for the redis hook and the express middelware.
 */
const defaults = {
  defaultDuration: 3600 * 24
};

export function cache(options: {
  duration?: number;
  defaultDuration?: number
}) {
  return function (hook: HookContext): Promise<HookContext> {
    const cacheOptions = hook.app.get('redisCache');

    const opts = Object.assign({}, defaults, cacheOptions, options);

    if (!hook.result.hasOwnProperty('cache')) {
      hook.result = {
        cache: {
          wrapped: hook.result,
          cached: false,
          duration: opts.duration || opts.defaultDuration
        }
      };
    }

    return Promise.resolve(hook);
  };
};

export function removeCacheInformation(_options: unknown) {
  return function (hook: HookContext) {
    if (hook.result.hasOwnProperty('cache')) {
      delete hook.result.cache;
    }

    return Promise.resolve(hook);
  };
};
