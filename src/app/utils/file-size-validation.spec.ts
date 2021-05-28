import {
  isOver2gb,
  isOver100mb,
  lessThanOrEqualToXSize,
} from './file-size-validation';

describe('file-size-validation', () => {
  describe('lessThanOrEqualToXSize', () => {
    const file = { size: 100 } as File;

    it('should be true if file size is less than the size', () => {
      expect(lessThanOrEqualToXSize(file, 101)).toBe(true);
      expect(lessThanOrEqualToXSize(file, 9999)).toBe(true);
    });

    it('should be true if file size is equal to the size', () => {
      expect(lessThanOrEqualToXSize(file, 100)).toBe(true);
    });

    it('should be false if file size is not less than to the size', () => {
      expect(lessThanOrEqualToXSize(file, 99)).toBe(false);
      expect(lessThanOrEqualToXSize(file, 0)).toBe(false);
    });
  });

  describe('isOver2gb', () => {
    it('should be true if file size is over than 2 GB.', () => {
      const file1 = { size: 2000000001 } as File;
      expect(isOver2gb(file1)).toBe(true);
      const file2 = { size: 9999999999 } as File;
      expect(isOver2gb(file2)).toBe(true);
    });

    it('should be false if file size is equal to 2 GB.', () => {
      const file1 = { size: 2000000000 } as File;
      expect(isOver2gb(file1)).toBe(false);
    });

    it('should be false if file size is not over than 2 GB', () => {
      const file1 = { size: 1 } as File;
      expect(isOver2gb(file1)).toBe(false);
      const file2 = { size: 1999999999 } as File;
      expect(isOver2gb(file2)).toBe(false);
    });
  });

  describe('isOver100mb', () => {
    it('should be true if file size is over than 100MB.', () => {
      const file1 = { size: 100000001 } as File;
      expect(isOver100mb(file1)).toBe(true);
      const file2 = { size: 999999999 } as File;
      expect(isOver100mb(file2)).toBe(true);
    });

    it('should be false if file size is equal to 100MB.', () => {
      const file1 = { size: 100000000 } as File;
      expect(isOver100mb(file1)).toBe(false);
    });

    it('should be false if file size is not over than 100MB', () => {
      const file1 = { size: 1 } as File;
      expect(isOver100mb(file1)).toBe(false);
      const file2 = { size: 99999999 } as File;
      expect(isOver100mb(file2)).toBe(false);
    });
  });
});
