import { ObjectId } from 'mongodb';

import { identity } from './user.js';

// Session store handed to aaw's authentication. Users already live in mongo, so
// aaw never opens a database of its own.
//
// aaw registers its built-in aaw/login, aaw/register and aaw/password/* events
// whatever `providers` says, so the store answers for them by name: there are no
// passwords in this database, and saying so beats letting them fail on a missing
// method.
const noPasswords = () => {
  throw Error('This marketplace has no password login — sign in with Google');
};

export default (mongo) => {
  const users = mongo.collection('users');
  const sessions = mongo.collection('sessions');

  return {
    findUser: (email) => users.findOne({ email }),

    verify: noPasswords,
    createUser: noPasswords,
    createReset: noPasswords,
    consumeReset: noPasswords,
    setPassword: noPasswords,

    createSession: async (user, ttl) => {
      const token = crypto.randomUUID();

      await sessions.insertOne({
        token,
        userId: new ObjectId(user.id),
        expiresAt: new Date(Date.now() + ttl),
      });

      return token;
    },

    readSession: async (token) => {
      const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } });
      if (!session) return null;

      const user = await users.findOne({ _id: session.userId });
      return user && identity(user);
    },

    endSession: (token) => sessions.deleteOne({ token }),
  };
};
