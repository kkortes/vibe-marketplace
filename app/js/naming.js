// A component is named in words and addressed by the slug read off them, the
// same on both sides of the socket.
export const lettered = (name) => (String(name).match(/\p{L}/gu) ?? []).length >= 3;

export const slugify = (name) =>
  String(name)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
