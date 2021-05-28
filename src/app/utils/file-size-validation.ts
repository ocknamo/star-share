import { File as IPFSFile } from 'ipfs-core-types/src/files';

import { gb, mb } from '../common/constants';

export const lessThanOrEqualToXSize = (
  file: File | IPFSFile,
  size: number
): boolean => {
  if (!file.size) {
    throw new Error(`Invalid file size. size: ${file.size}`);
  }

  return file.size <= size;
};

export const isOver2gb = (file: File | IPFSFile): boolean =>
  !lessThanOrEqualToXSize(file, 2 * gb);

export const isOver100mb = (file: File | IPFSFile): boolean =>
  !lessThanOrEqualToXSize(file, 100 * mb);
