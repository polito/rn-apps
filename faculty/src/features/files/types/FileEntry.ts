/** Canonical file entry type used across Files feature screens. */
export type MimeType =
  | 'application/pdf'
  | 'image/png'
  | 'image/jpeg'
  | 'video/mp4'
  | 'application/zip'
  | (string & {});

export type FileEntry = {
  id: string;
  name: string;
  date?: string;
  size?: number;
  mimeType?: MimeType;
};
