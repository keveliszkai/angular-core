/* tslint:disable */
import './array.extension';

describe('Extension: ArrayExtension', () => {
  let numberArray: number[];

  beforeEach(() => {
    numberArray = [0, 1, 2, 3, 4, 5];
  });

  it('should returns the first element', () => {
    const result = numberArray.first();
    expect(result).toEqual(numberArray[0]);
  });

  it('should returns the last element', () => {
    const result = numberArray.last();
    expect(result).toEqual(numberArray[numberArray.length - 1]);
  });

  it('should returns null for the first element, if that is empty', () => {
    numberArray = [];
    const result = numberArray.first();
    expect(result).toEqual(null);
  });

  it('should returns null for the last element, if that is empty', () => {
    numberArray = [];
    const result = numberArray.last();
    expect(result).toEqual(null);
  });

  it('should detect the exists of the array', () => {
    let result = numberArray.exists();
    expect(result).toEqual(true);

    const nullArray = [];

    result = nullArray.exists();
    expect(result).toEqual(false);
  });

  it('should determine the intersects of two array', () => {
    const arrayTwo = [4, 5, 6, 7];

    const result = numberArray.intersect(arrayTwo);

    expect(result).toEqual([4, 5]);
  });
});
