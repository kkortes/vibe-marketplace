import { identity } from '../../user.js';

// Simulates a Google sign-in on previews: whoever asks is signed in as the user
// `PREVIEW_SIGNIN` names. That var lives only in the `previews` block of
// wrangler.jsonc, so production has none and refuses.
export default async (_, { db, env, authenticate }) => {
  if (!env.PREVIEW_SIGNIN) throw Error('Preview sign-in exists only on previews');

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(env.PREVIEW_SIGNIN).first();
  if (!user) throw Error(`${env.PREVIEW_SIGNIN} has never signed in to this database`);

  return authenticate(identity(user));
};
