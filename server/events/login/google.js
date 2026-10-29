import { now } from '../../db.js';
import { identity } from '../../user.js';

export default async ({ token }, { db, authenticate }) => {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  if (!res.ok) throw Error('Invalid Google token');

  const { sub, email, name, picture, aud } = await res.json();

  if (aud !== process.env.GOOGLE_CLIENT_ID) throw Error('Invalid token audience');

  const user = db
    .query(
      `INSERT INTO users (id, googleId, email, name, picture, createdAt, updatedAt)
       VALUES ($id, $googleId, $email, $name, $picture, $now, $now)
       ON CONFLICT (googleId) DO UPDATE SET email = $email, name = $name, picture = $picture, updatedAt = $now
       RETURNING *`,
    )
    .get({ id: crypto.randomUUID(), googleId: sub, email, name, picture, now: now() });

  return authenticate(identity(user));
};
