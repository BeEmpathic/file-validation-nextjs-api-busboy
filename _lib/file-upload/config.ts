const FILES_MAX_AMOUNT: number = process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT
  ? parseInt(process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT, 10)
  : 10;
const FILE_MAX_SIZE = process.env.NEXT_PUBLIC_FILE_MAX_SIZE
  ? parseInt(process.env.NEXT_PUBLIC_FILE_MAX_SIZE) * 1024 * 1024
  : 5 * 1024 * 1024; // in MB

const ONLY_MEDIA_ALLOWED: boolean =
  process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

export { FILES_MAX_AMOUNT, FILE_MAX_SIZE, ONLY_MEDIA_ALLOWED };
