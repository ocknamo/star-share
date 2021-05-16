import { concat } from 'uint8arrays';

export const fileContentToBlobUrl = async (
  fileContent: AsyncIterable<Uint8Array>
): Promise<string> => {
  const all = await concatAsyncIterable(fileContent);

  return uint8ArrayToURL(all);
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

export const uint8ArrayToURL = (typedArray: Uint8Array): string =>
  URL.createObjectURL(new Blob([typedArray.buffer]));
