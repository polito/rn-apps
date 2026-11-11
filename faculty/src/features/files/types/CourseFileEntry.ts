import type { FileDownloadStatus } from '@polito/lib/ui';

import { FileEntry } from './FileEntry';

export type CourseFileEntry = {
  file: FileEntry;
  status: FileDownloadStatus;
  isSelected?: boolean;
};
