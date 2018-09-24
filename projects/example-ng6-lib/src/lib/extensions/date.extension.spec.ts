/* tslint:disable */
import './date.extension';

describe('Extension: DateExtension', () => {
  let date: Date;

  beforeEach(() => {
    date = new Date(2001, 1, 1, 1, 1, 1);
  });

  it('should format to YYYY-MM-DD', () => {
    const result = date.toYMD();
    expect(result).toEqual('2001-01-01');
  });

  it('should format to YYYY-MM-DD HH:mm:ss', () => {
    const result = date.toSQL();
    expect(result).toEqual('2001-01-01 01:01:01');
  });
});
