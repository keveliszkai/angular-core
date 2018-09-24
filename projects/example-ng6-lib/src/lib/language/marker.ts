/**
 * Helps to extract the translation keys.
 *
 * @export
 * @param {(string | string[])} str string or string[]. Translation key/keys.
 * @returns {string}
 */
export function _(str: string | string[]): string {
  if (str instanceof Array) {
    return str.first();
  } else {
    return str;
  }
}
