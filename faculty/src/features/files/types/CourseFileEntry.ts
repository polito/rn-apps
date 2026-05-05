import { FileEntry } from './FileEntry';

export type CourseFileEntry = {
  file: FileEntry;
  status: 'idle' | 'downloading' | 'downloaded' | 'error';
  isSelected?: boolean;
};
