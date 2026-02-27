export default async ({ token }, { mongo }) => {
  const users = mongo.collection('users');
  const user = await users.findOne({ sessionToken: token });

  if (!user) throw Error('Session expired');

  return { name: user.name, email: user.email, picture: user.picture, token: user.sessionToken };
};
