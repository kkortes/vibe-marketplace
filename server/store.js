import { identity } from './user.js';

// Session store handed to aaw's authentication. Users already live in the
// marketplace database, so aaw never opens a database of its own.
//
// aaw registers its built-in aaw/login, aaw/register and aaw/password/* events
// whatever `providers` says, so the store answers for them by name: there are no
// passwords in this database, and saying so beats letting them fail on a missing
// method.
const noPasswords = () => {
  throw Error('This marketplace has no password login — sign in with Google');
};

export default (db) => ({
  findUser: (email) => db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first(),

  verify: noPasswords,
  createUser: noPasswords,
  createReset: noPasswords,
  consumeReset: noPasswords,
  setPassword: noPasswords,

  createSession: async (user, ttl) => {
    const token = crypto.randomUUID();

    await db.batch([
      db.prepare('DELETE FROM sessions WHERE expiresAt <= ?').bind(Date.now()),
      db.prepare('INSERT INTO sessions (token, userId, expiresAt) VALUES (?, ?, ?)').bind(token, user.id, Date.now() + ttl),
    ]);

    return token;
  },

  readSession: async (token) => {
    const user = await db
      .prepare(
        'SELECT users.* FROM users JOIN sessions ON sessions.userId = users.id WHERE token = ? AND expiresAt > ?',
      )
      .bind(token, Date.now())
      .first();

    return user && identity(user);
  },

  endSession: (token) => db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run(),
});
