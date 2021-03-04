import {
  binaryStringToDataUri,
  concatAsyncIterable,
  fileContentToDataUri,
  uint8ArrayToBinaryString,
} from './convert';

describe('convert.ts', () => {
  const myAsyncIterable: AsyncIterable<Uint8Array> = {
    async *[Symbol.asyncIterator]() {
      yield Uint8Array.of(1, 2, 3);
      yield Uint8Array.of(4, 5, 6);
      yield Uint8Array.of(7, 8, 9);
    },
  };

  describe('fileContentToDataUri', () => {
    it('should convert filecontent to DataURI', async () => {
      await expect(fileContentToDataUri(myAsyncIterable)).resolves.toBe(
        'data:application/octet-stream;base64,AQIDBAUGBwgJ'
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

  describe('uint8ArrayToBinaryString', () => {
    it('should convert uint8Array to BinaryString', () => {
      expect(uint8ArrayToBinaryString(Uint8Array.of(90, 91))).toBe('Z[');
    });
  });

  describe('binaryStringToDataUri', () => {
    it('should convert BinaryString to DataUri', () => {
      expect(binaryStringToDataUri('Z[')).toBe(
        'data:application/octet-stream;base64,Wls='
      );
    });
  });
});
