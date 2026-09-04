import aaw from '@ape-egg/async-await-websockets/server.js';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import createIndexes from './indexes.js';
import startHttp from './http.js';
import store from './store.js';

dotenv.config();

const { PORT = 1337, HTTP_PORT = 8080, MONGO_CONNECT } = process.env;

const client = new MongoClient(MONGO_CONNECT);
await client.connect();

const mongo = client.db('vibe-marketplace');

await createIndexes(mongo);
startHttp(mongo, HTTP_PORT);

aaw(
  'events',
  { mongo },
  PORT,
  ({ event, websocketKey, error }) =>
    console.info(`${error ? '🔴' : '🟢'} ${event} | ${websocketKey}`),
  { store: store(mongo) },
);
