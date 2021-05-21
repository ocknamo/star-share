import { gb } from '../common/constants';

export const lessThanOrEqualToXSize = (file: File, size: number): boolean =>
  file.size <= size;

export const isOver2gb = (file: File): boolean =>
  !lessThanOrEqualToXSize(file, 2 * gb);
