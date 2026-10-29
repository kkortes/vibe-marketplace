import { now } from '../../db.js';
import { identity } from '../../user.js';

export default async ({ token }, { db, env, authenticate }) => {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  if (!res.ok) throw Error('Invalid Google token');

  const { sub, email, name, picture, aud } = await res.json();

  if (aud !== env.GOOGLE_CLIENT_ID) throw Error('Invalid token audience');

  const user = await db
    .prepare(
      `INSERT INTO users (id, googleId, email, name, picture, createdAt, updatedAt)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)
       ON CONFLICT (googleId) DO UPDATE SET email = ?3, name = ?4, picture = ?5, updatedAt = ?6
       RETURNING *`,
    )
    .bind(crypto.randomUUID(), sub, email, name, picture, now())
    .first();

  return authenticate(identity(user));
};
