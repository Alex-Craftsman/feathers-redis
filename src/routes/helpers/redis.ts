import type { RedisClientType } from "redis";

export default class RedisCache {
  client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  /**
   * scan the redis index
   */
  // scan() {
  //   // starts at 0 if cursor is again 0 it means the iteration is finished
  //   let cursor = '0';

  //   return new Promise((resolve, reject) => {
  //     this.client.scan(cursor, 'MATCH', '*', 'COUNT', '100', (err, reply) => {
  //       if (err) {
  //         reject(err);
  //       }

  //       cursor = reply[0];
  //       if (cursor === '0') {
  //         resolve(reply[1]);
  //       } else {
  //         // do your processing
  //         // reply[1] is an array of matched keys.
  //         // console.log(reply[1]);
  //         return this.scan();
  //       }
  //       return false;
  //     });

  //   });
  // }

  /**
   * Async scan of the redis index
   * Do not for get to passin a Set
   * myResults = new Set();
   *
   * scanAsync('0', "NOC-*[^listen]*", myResults).map(
   *   myResults => { console.log( myResults); }
   * );
   *
   * @param {String} cursor - string '0'
   * @param {String} patern - string '0'
   * @param {Set} returnSet - pass a set to have unique keys
   */
  // scanAsync(cursor, pattern, returnSet) {
  //   // starts at 0 if cursor is again 0 it means the iteration is finished

  //   return new Promise((resolve, reject) => {
  //     this.client.scan(cursor, 'MATCH', pattern, 'COUNT', '100', (err, reply) => {

  //       if (err) {
  //         reject(err);
  //       }

  //       cursor = reply[0];
  //       const keys = reply[1];

  //       keys.forEach((key, i) => {
  //         returnSet.add(key);
  //       });

  //       if (cursor === '0') {
  //         resolve(Array.from(returnSet));
  //       }

  //       return this.scanAsync(cursor, pattern, returnSet);
  //     });
  //   });
  // }

  /**
   * Clean single item from the cache
   * @param {string} key - the key to find in redis
   */
  clearSingle(key: string) {
    return new Promise((resolve, reject) => {
      this.client.del(key).then((reply: number) => {
        if (reply === 1) {
          resolve(true);
        }
        resolve(false);
      }).catch(err => {
        reject(err)
      });
    });
  }

  /**
   * Clear a group
   * @param {string} key - key of the group to clean
   */
  clearGroup(key: string) {
    return new Promise((resolve, reject) => {
      this.client.lRange(key, 0, -1).then((reply) => {
        this.clearAll(reply).then(
          _ => this.client.del(key)
        ).then(r => resolve(r));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Clear all keys of a redis list
   * @param {Object[]} array
   */
  clearAll(array: string[]) {
    return new Promise(resolve => {
      if (!array.length) resolve(false);
      let i = 0;

      for (i; i < array.length; i++) {
        this.clearSingle(array[i]).then(r => {
          if (i === array.length - 1) {
            resolve(r);
          }
        });
      }
    });
  }
};
