export type returnedInfoType = {
  pass: boolean;
  message: string;
  status: number;
  uploadedFilesNames: string[];
  rejectedFiles: Array<{
    fileName: string;
    reason: string;
  }>;
  error: string;
};
