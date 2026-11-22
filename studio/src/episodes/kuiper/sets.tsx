import type { Registry } from './render';
import { SETS_A } from './sets-a';
import { SETS_B } from './sets-b';

export const SETS: Registry['sets'] = {
  ...SETS_A,
  ...SETS_B,
};
