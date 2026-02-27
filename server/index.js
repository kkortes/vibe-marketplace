import aaw from 'async-await-websockets/server.js';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import startHttp from './http.js';

dotenv.config();

const { PORT = 1337, HTTP_PORT = 8080, MONGO_CONNECT } = process.env;

const client = new MongoClient(MONGO_CONNECT);
await client.connect();

const mongo = client.db('vibe-marketplace');

startHttp(mongo, HTTP_PORT);

aaw(
  'events',
  { mongo },
  PORT,
  ({ event, websocketKey, async: isAsync, error }) => {
    console.info(`${error ? '🔴' : '🟢'} ${event} | ${websocketKey}`);
  },
);
