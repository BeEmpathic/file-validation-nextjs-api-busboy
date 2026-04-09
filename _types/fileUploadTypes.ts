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

// you need to check the type returned by function to this type cause it says that you can't just return null as string check that shit what can I return
