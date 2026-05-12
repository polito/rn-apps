/** Generic upload failure wrapper for Files feature. */
export class FileUploadError extends Error {
  override name = FileUploadError.name;
}
