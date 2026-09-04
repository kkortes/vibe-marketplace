export const identity = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  picture: user.picture,
});

export const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
