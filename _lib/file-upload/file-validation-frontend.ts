export function checkFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return false;
  }
  if (!file.type.startsWith("image") || !file.type.startsWith("video")) {
    return false;
  }
}
