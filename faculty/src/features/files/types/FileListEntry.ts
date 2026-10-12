import type { ReactNode } from 'react';

import type { FileDownloadStatus } from '@polito/lib/ui';

export type FileListEntry = {
  id: string;
  name: string;
  subtitle?: string;
  status: FileDownloadStatus;
  onPress: () => void;
  isFolder?: boolean;
  mimeType?: string;
  onLongPress?: () => void;
  onActionPress?: () => void;
  trailing?: ReactNode;
};
