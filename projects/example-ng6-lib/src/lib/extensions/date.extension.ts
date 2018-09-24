Date.prototype.toSQL = toSQL;
Date.prototype.toYMD = toYMD;

interface Date {
  toSQL: typeof toSQL;
  toYMD: typeof toYMD;
}

/**
 * Internal helper/formatter function.
 * @param d number needs to be padded.
 */
function padDate(d) {
  const margin = 10;
  return d < margin ? `0${d.toString()}` : d.toString();
}

/**
 * This function formates the date to YYYY-MM-DD format.
 * @returns string
 * @example let date = new Date();
 * date.toYMD();
 */
function toYMD(this: Date): string {
  return `${this.getFullYear()}-${padDate(this.getDate())}-${padDate(this.getDate())}`;
}

/**
 * This function formates the date to YYYY-MM-DD HH:mm:ss format.
 * @returns string
 * @example let date = new Date();
 * date.toSQL();
 */
function toSQL(this: Date): string {
  return `${this.toYMD()} ${padDate(this.getHours())}:${padDate(this.getMinutes())}:${padDate(this.getSeconds())}`;
}
