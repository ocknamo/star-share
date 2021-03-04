import { concat } from 'uint8arrays';

export const fileContentToDataUri = async (
  fileContent: AsyncIterable<Uint8Array>
): Promise<string> => {
  const all = await concatAsyncIterable(fileContent);
  return binaryStringToDataUri(uint8ArrayToBinaryString(all));
};

export const concatAsyncIterable = async (
  ai: AsyncIterable<Uint8Array>
): Promise<Uint8Array> => {
  const content = [];
  for await (const chunk of ai) {
    content.push(chunk);
  }

  return concat(content);
};

export const uint8ArrayToBinaryString = (u8: Uint8Array): string =>
  Array.from(u8, (e) => String.fromCharCode(e)).join('');

export const binaryStringToDataUri = (bs: string): string =>
  'data:application/octet-stream;base64,' + btoa(bs);
