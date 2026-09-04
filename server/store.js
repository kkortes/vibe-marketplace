import { ObjectId } from 'mongodb';

import { identity } from './user.js';

// Session store handed to aaw's authentication. Users already live in mongo,
// so aaw never opens a database of its own.
export default (mongo) => {
  const users = mongo.collection('users');
  const sessions = mongo.collection('sessions');

  return {
    findUser: (email) => users.findOne({ email }),

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
