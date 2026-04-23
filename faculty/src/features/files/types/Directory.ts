import { FileEntry } from './FileEntry';

/** Canonical directory type used across Files feature screens. */
export type Directory = {
  id: number;
  name: string;
  files: FileEntry[];
};
