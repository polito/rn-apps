import { FileEntry } from '../types/FileEntry';

export const mapFileEntry = (raw: {
  id: string | number;
  name: string;
  date?: string;
  size?: number;
  mimeType?: string;
}): FileEntry => ({
  id: String(raw.id),
  name: raw.name,
  date: raw.date,
  size: raw.size,
  mimeType: raw.mimeType,
});
