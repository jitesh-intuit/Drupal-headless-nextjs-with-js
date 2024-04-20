export function isRelative(url) {
  return !new RegExp('^(?:[a-z]+:)?//', 'i').test(url);
}
