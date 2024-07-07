// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema';
import type { Static } from '@feathersjs/typebox';
import { getValidator, querySyntax, Type } from '@feathersjs/typebox';

import type { HookContext } from "@feathersjs/feathers";
import { dataValidator, queryValidator } from '../validators';

import type { CacheService } from './cache.class';

// Main data model schema
export const cacheSchema = Type.Object(
  {
    id: Type.String(),
    value: Type.Unknown(),
  },
  { $id: 'Cache', additionalProperties: false },
);
export type Cache = Static<typeof cacheSchema>;
export const cacheValidator = getValidator(cacheSchema, dataValidator);
export const cacheResolver = resolve<Cache, HookContext<CacheService>>({});

export const cacheExternalResolver = resolve<Cache, HookContext<CacheService>>(
  {},
);

// Schema for creating new entries
export const cacheDataSchema = Type.Pick(cacheSchema, ['value'], {
  $id: 'CacheData',
});
export type CacheData = Static<typeof cacheDataSchema>;
export const cacheDataValidator = getValidator(cacheDataSchema, dataValidator);
export const cacheDataResolver = resolve<Cache, HookContext<CacheService>>({});

// Schema for updating existing entries
export const cachePatchSchema = Type.Partial(cacheSchema, {
  $id: 'CachePatch',
});
export type CachePatch = Static<typeof cachePatchSchema>;
export const cachePatchValidator = getValidator(
  cachePatchSchema,
  dataValidator,
);
export const cachePatchResolver = resolve<Cache, HookContext<CacheService>>({});

// Schema for allowed query properties
export const cacheQueryProperties = Type.Pick(cacheSchema, ['id', 'value']);
export const cacheQuerySchema = Type.Intersect(
  [
    querySyntax(cacheQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false },
);
export type CacheQuery = Static<typeof cacheQuerySchema>;
export const cacheQueryValidator = getValidator(
  cacheQuerySchema,
  queryValidator,
);
export const cacheQueryResolver = resolve<
  CacheQuery,
  HookContext<CacheService>
>({});
