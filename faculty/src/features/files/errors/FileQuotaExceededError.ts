/** Specific upload error when storage quota is exceeded. */
export class FileQuotaExceededError extends Error {
  override name = FileQuotaExceededError.name;
}
