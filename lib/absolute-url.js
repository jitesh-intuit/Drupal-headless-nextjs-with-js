export function absoluteURL(uri) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${uri}`;
}
