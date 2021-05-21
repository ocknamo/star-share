import { gb } from '../common/constants';

export const biteToGb = (value: number): number => value / gb;

export const floorToDigits = (value: number, digits): number =>
  Math.floor(value * 10 ** digits) / 10 ** digits;
