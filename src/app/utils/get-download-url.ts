export const getDownloadUrl = (
  baseUrl: string,
  cid: string,
  fileName: string
): string => `${baseUrl}/#/download?CID=${cid}&fileName=${fileName}`;
