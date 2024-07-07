# @crfmn/feathers-redis

Cache any FeathersJS API route with Redis. This package provides hooks to integrate Redis caching into your FeathersJS applications.

## Installation

To install the package, run:

```bash
npm install @crfmn/feathers-redis
```

## Usage

### Configuration

To configure the redis connection the feathers configuration system can be used.

```js
//config/default.json
{
  "redis": {
    "socket": {
      "host": "my-redis-service.example.com",
      "port": 1234
    }
  }
}
```

### Setting up the Redis Cache Hook

To use the Redis cache hook, you need to import and configure it in your FeathersJS application.

```tsx
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import redis from 'redis';
import { cacheBeforeHook, cacheAfterHook } from '@crfmn/feathers-redis';

const app = express(feathers());

// Create a Redis client
const redisClient = redis.createClient();

// Configure the hooks for a service
app.service('my-service').hooks({
  before: {
    all: [cacheBeforeHook(redisClient)],
  },
  after: {
    all: [cacheAfterHook(redisClient)],
  },
});
```

## Example

Here is a complete example of using the `feathers-redis` hooks in a FeathersJS application:

```tsx
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import redis from 'redis';
import { cacheBeforeHook, cacheAfterHook } from '@crfmn/feathers-redis';

const app = express(feathers());

// Create a Redis client
const redisClient = redis.createClient();

// Define a simple service
app.use('/messages', {
  async find(params) {
    return [{ message: 'Hello world' }];
  },
});

// Configure the hooks for the messages service
app.service('messages').hooks({
  before: {
    all: [cacheBeforeHook(redisClient)],
  },
  after: {
    all: [cacheAfterHook(redisClient)],
  },
});

app.listen(3030).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);
```

## API

### Hooks

#### cacheBeforeHook

The `cacheBeforeHook` checks if a cached response exists in Redis before the service method is called. If a cached response is found, it is returned immediately.

##### Parameters

- `redisClient`: The Redis client instance.

##### Usage

```tsx
cacheBeforeHook(redisClient);
```

#### cacheAfterHook

The `cacheAfterHook` stores the service method response in Redis after it is called.

##### Parameters

- `redisClient`: The Redis client instance.

##### Usage

```tsx
cacheAfterHook(redisClient);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

MIT License. See LICENSE for details.

## Author

Alex Craftsman
- Website: https://crf.mn/
- Email: alx@crf.mn
- GitHub: https://github.com/Alex-Craftsman