import { returnedInfoType } from "@/_types/fileUploadTypes";
// variables for the limits from env processed
const FILES_MAX_AMOUNT: number = process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT
  ? parseInt(process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT, 10)
  : 10;
const FILE_MAX_SIZE = process.env.NEXT_PUBLIC_FILE_MAX_SIZE
  ? parseInt(process.env.NEXT_PUBLIC_FILE_MAX_SIZE) * 1024 * 1024
  : 5 * 1024 * 1024; // in MB

console.log(FILE_MAX_SIZE);

const ONLY_MEDIA_ALLOWED: boolean =
  process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

export class FileValidationError extends Error {
  result: returnedInfoType;
  constructor(result: returnedInfoType) {
    super(result.error);

    this.name = "ValidationError";
    this.result = {
      pass: false,
      message: "Something is not right with validation error class",
      status: 400,
      uploadedFilesNames: [],
      rejectedFiles: [],
      error: "Unknow validation error",
    };
  }
}

function checkFile(
  file: File,
  filesAmount: number = FILES_MAX_AMOUNT,
  fileSizeLimit: number = FILE_MAX_SIZE,
  onlyMedia: boolean = ONLY_MEDIA_ALLOWED,
):
  | {
      fileName: string;
      reason: string;
    }
  | true {
  console.log("The size of the file", file.size);
  if (file.size > fileSizeLimit) {
    return {
      fileName: file.name,
      reason: `Is too large only up to ${fileSizeLimit} MB allowed`,
    };
  }
  if (onlyMedia) {
    if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
      return {
        fileName: file.name,
        reason:
          "It isn't an image or video, wrong file type only png, jpg, mp4 etc.",
      };
    }
  }

  return true;
}

export async function fileUpload(
  files: File[],
  fileSizeLimit: number = 5 * 1024 * 1024,
  onlyMedia: boolean = false,
) {
  return new Promise<returnedInfoType>(async (resolve, reject) => {
    const result: returnedInfoType = {
      pass: false,
      message: "Something is wrong",
      status: 400,
      uploadedFilesNames: [],
      rejectedFiles: [],
      error: "",
    };
    if (!files || files.length <= 0) {
      result.pass = false;
      result.error = "No files selected!";

      reject(result);
    }

    for (const file of files) {
      try {
        const formData = new FormData();

        const validation = await checkFile(
          file,
          FILES_MAX_AMOUNT,
          FILE_MAX_SIZE,
          onlyMedia,
        );
        if (validation === true) {
          formData.append("file", file);
        } else {
          result.rejectedFiles.push(validation);
          result.error = "File didn't pass validation!";
          result.pass = false;

          reject(result);
        }

        const response = await fetch("/api/file-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          reject(result);
        }
        const backendData = await response.json();

        result.message = backendData.message;
        result.status = backendData.status; // this overwrites the status it's a problem
        result.uploadedFilesNames.push(backendData.uploadedFilesNames);
        result.rejectedFiles.push(backendData.rejectedFiles);
        result.error = backendData.error;
        result.pass = backendData.pass;
      } catch (e: any) {
        console.error("error happened: ", e);

        result.error =
          "Something went wrong! We got unusual error. Probably server";

        result.pass = false;
        reject(result);
      }
    }

    // there is type of any on error check if you can do something about it.

    resolve(result);
  });
}
