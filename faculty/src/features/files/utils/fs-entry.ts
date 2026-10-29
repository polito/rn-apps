import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';

/** Type guard to discriminate directory entries from files. */
export const isDirectory = (
  entry: Directory | FileEntry,
): entry is Directory => {
  return Array.isArray((entry as Directory).files);
};
