import {
  concatAsyncIterable,
  fileContentToBlobUrl,
  uint8ArrayToURL,
} from './convert';

describe('convert.ts', () => {
  const myAsyncIterable: AsyncIterable<Uint8Array> = {
    async *[Symbol.asyncIterator]() {
      yield Uint8Array.of(1, 2, 3);
      yield Uint8Array.of(4, 5, 6);
      yield Uint8Array.of(7, 8, 9);
    },
  };

  describe('fileContentToBlobUrl', () => {
    global.URL.createObjectURL = jest.fn(() => 'bloburl');
    it('should convert file content to BlobURL', async () => {
      await expect(fileContentToBlobUrl(myAsyncIterable)).resolves.toBe(
        'bloburl'
      );
    });
  });

  describe('concatAsyncIterable', () => {
    it('should concat AsyncIterable Uint8Array', async () => {
      await expect(concatAsyncIterable(myAsyncIterable)).resolves.toEqual(
        Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9)
      );
    });
  });

  describe('uint8ArrayToURL', () => {
    global.URL.createObjectURL = jest.fn(() => 'bloburl');
    it('should convert uint8Array to Blob URL', () => {
      expect(uint8ArrayToURL(Uint8Array.of(90, 91))).toBe('bloburl');
    });
  });
});
