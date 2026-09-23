import { en } from './en';

/** The single English copy table shared by the marketing site. */
export type Copy = typeof en;

export function getCopy(): Copy {
  return en;
}
