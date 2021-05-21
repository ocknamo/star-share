import { biteToGb, floorToDigits } from './calc-utils';

describe('calc-utils', () => {
  it('should change unit bite to gb', () => {
    expect(biteToGb(2147483648)).toBe(2.147483648);
  });

  it('should floor to the digits', () => {
    expect(floorToDigits(2.147483648, 1)).toBe(2.1);
  });
});
