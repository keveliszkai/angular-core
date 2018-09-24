/* tslint:disable */
import { TruncatePipe } from './truncate.pipe';

describe('Pipe: Truncate', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('providing no changes on short text', () => {
    expect(pipe.transform('short text')).toEqual('short text');
  });

  it('providing ... after 100 characters (default)', () => {
    let text = '';
    while (text.length < 99) {
      text += 'A';
    }

    // 99 long text
    let result = pipe.transform(text);
    expect(result.slice(-1)).toEqual('A');

    text += 'AA';

    // 101 long text
    result = pipe.transform(text);
    expect(result.slice(-1)).toEqual('.');
  });

  it('providing ... after N characters', () => {
    const N = 200;
    let text = '';
    while (text.length < 199) {
      text += 'A';
    }

    // 199 long text
    let result = pipe.transform(text, N);
    expect(result.slice(-1)).toEqual('A');

    text += 'AA';

    // 201 long text
    result = pipe.transform(text, N);
    expect(result.slice(-1)).toEqual('.');
  });
});
