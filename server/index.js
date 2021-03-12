/**
 * This server represents the API middle layer between our React frontend and our Redis + Postgres data stores.
 * Contains logic to connect to redis and postgres and respond to AJAX requests from our React frontend.
 *
 * @note: our postgres db and our redis store will store the indices of the fibonacci series the user passes it.
 */
const keys = require('./keys');

/** Express App Setup **/
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // treat HTTP POST request body's as json

/** Postgres Client Setup **/
const {Pool} = require('pg');

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('connect', () => {
    pgClient
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')  // only one column called 'number'
        .catch(err => console.error(err));
});

/** Redis Client Setup **/
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000  // if loose connection, try connect once every second
});
const redisPublisher = redisClient.duplicate();

/** Express Route Handlers **/
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const {index} = req.body;
    if (parseInt(index) > 40)
        return res.status(422).send('Index too high. Naive Fib implementation used!');

    // Store this new index into both our redis store and our postgres db.
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    redisClient.hset('values', index, 'Fib for this index has yet to be calculated by the worker.');
    redisPublisher.publish('insert', index);

    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening on port 5000');
});