/**
 * This worker contains logic to perform the fibonacci calculation and watches the Redis store for newly added
 * keys; calculates the fibonacci number for that key and inserts back into the store.
 */
const keys = require('./keys');
const redis = require('redis');


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

const fib = idx => {
    return idx < 2 ? 1 : fib(idx - 1) + fib(idx - 2);
}

// Every time a new value is inserted in our store, run our fib() on it
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
});

sub.subscribe('insert');  // subscribe to insert events