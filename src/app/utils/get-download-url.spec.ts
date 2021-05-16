import { getDownloadUrl } from './get-download-url';

describe('getDownloadUrl', () => {
  it('should get url from cid and fileName', () => {
    const baseUrl = 'BASE_URL';
    const cid = 'CID';
    const fileName = 'FILE_NAME';
    expect(getDownloadUrl(baseUrl, cid, fileName)).toBe(
      'BASE_URL/#/download?CID=CID&fileName=FILE_NAME'
    );
  });
});
