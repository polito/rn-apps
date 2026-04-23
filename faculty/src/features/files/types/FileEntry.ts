/** Canonical file entry type used across Files feature screens. */
export type FileEntry = {
  id: string;
  name: string;
  date?: string;
  size?: number;
  mimeType?: string;
};
