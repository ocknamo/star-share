import { IPFSEntry } from 'ipfs-core-types/src/root';

import { gb, mb } from '../common/constants';

export const lessThanOrEqualToXSize = (
  file: File | IPFSEntry,
  size: number
): boolean => {
  if (!file.size) {
    throw new Error(`Invalid file size. size: ${file.size}`);
  }

  return file.size <= size;
};

export const isOver2gb = (file: File | IPFSEntry): boolean =>
  !lessThanOrEqualToXSize(file, 2 * gb);

export const isOver100mb = (file: File | IPFSEntry): boolean =>
  !lessThanOrEqualToXSize(file, 100 * mb);
