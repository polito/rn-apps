export const formatFolderDetails = (
  totalBytes: number,
  fileCount: number,
  folderCount = 0,
) => {
  if (totalBytes === 0 && fileCount === 0 && folderCount === 0) {
    return undefined;
  }

  const sizeInMb = totalBytes / (1024 * 1024);
  const sizeLabel =
    sizeInMb >= 1
      ? `${Math.round(sizeInMb)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;
  const filesLabel = `${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
  if (folderCount <= 0) {
    return `${sizeLabel} - ${filesLabel}`;
  }
  const foldersLabel = `${folderCount} ${folderCount === 1 ? 'folder' : 'folders'}`;

  return `${sizeLabel} - ${filesLabel} - ${foldersLabel}`;
};
