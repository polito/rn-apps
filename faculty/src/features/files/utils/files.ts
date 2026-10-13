const BYTES_IN_KB = 1024;
const BYTES_IN_MB = BYTES_IN_KB * 1024;
const BYTES_IN_GB = BYTES_IN_MB * 1024;

export const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < BYTES_IN_MB) {
    return `${(sizeInBytes / BYTES_IN_KB).toFixed(1)} KB`;
  }
  if (sizeInBytes < BYTES_IN_GB) {
    return `${Math.round(sizeInBytes / BYTES_IN_MB)} MB`;
  }
  return `${Math.round(sizeInBytes / BYTES_IN_GB)} GB`;
};

export const formatFileDate = (date: Date) => {
  return `${date.toLocaleDateString()} ${date
    .toLocaleTimeString()
    .slice(0, -3)}`;
};
