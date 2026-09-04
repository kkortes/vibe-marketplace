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

// Google is the only way to get a session here, and it is stated rather than
// inherited: `providers: []` turns off aaw's default sqlite password login and
// leaves no social provider registered, so nothing mounts an HTTP /auth/* route
// and the sole path to a token is this app's own `login/google` event. aaw is
// kept for what it is good at — binding a session to a connection and guarding
// everything under events/auth/.
aaw(
  'events',
  { mongo },
  PORT,
  ({ event, websocketKey, error }) =>
    console.info(`${error ? '🔴' : '🟢'} ${event} | ${websocketKey}`),
  { providers: [], store: store(mongo) },
);
