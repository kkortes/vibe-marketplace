import { identity } from '../../user.js';

export default async ({ token }, { mongo, authenticate }) => {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  if (!res.ok) throw Error('Invalid Google token');

  const { sub, email, name, picture, aud } = await res.json();

  if (aud !== process.env.GOOGLE_CLIENT_ID) throw Error('Invalid token audience');

  const user = await mongo.collection('users').findOneAndUpdate(
    { 'identities.provider': 'google', 'identities.id': sub },
    {
      $set: { email, name, picture, updatedAt: new Date() },
      $setOnInsert: { identities: [{ provider: 'google', id: sub }], createdAt: new Date() },
    },
    { upsert: true, returnDocument: 'after' },
  );

  return authenticate(identity(user));
};
