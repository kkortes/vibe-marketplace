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

export default (db) => {
  const userByEmail = db.query('SELECT * FROM users WHERE email = $email');
  const userBySession = db.query(
    'SELECT users.* FROM users JOIN sessions ON sessions.userId = users.id WHERE token = $token AND expiresAt > $now',
  );
  const insertSession = db.query('INSERT INTO sessions (token, userId, expiresAt) VALUES ($token, $userId, $expiresAt)');
  const expireSessions = db.query('DELETE FROM sessions WHERE expiresAt <= $now');
  const deleteSession = db.query('DELETE FROM sessions WHERE token = $token');

  return {
    findUser: (email) => userByEmail.get({ email }),

    verify: noPasswords,
    createUser: noPasswords,
    createReset: noPasswords,
    consumeReset: noPasswords,
    setPassword: noPasswords,

    createSession: (user, ttl) => {
      const token = crypto.randomUUID();

      expireSessions.run({ now: Date.now() });
      insertSession.run({ token, userId: user.id, expiresAt: Date.now() + ttl });

      return token;
    },

    readSession: (token) => {
      const user = userBySession.get({ token, now: Date.now() });
      return user && identity(user);
    },

    endSession: (token) => deleteSession.run({ token }),
  };
};
