import { returnedInfoType } from "@/_types/fileUploadTypes";

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
  fileSizeLimit: number = 5 * 1024 * 1024,
  onlyMedia: boolean = false,
):
  | {
      fileName: string;
      reason: string;
    }
  | true {
  if (file.size > fileSizeLimit) {
    return {
      fileName: file.name,
      reason: `Is too large only up to ${fileSizeLimit / 1024 / 1024} MB allowed`,
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
  file: File,
  fileSizeLimit: number = 5 * 1024 * 1024,
  onlyMedia: boolean = false,
) {
  return new Promise<returnedInfoType>(async (resolve, reject) => {
    let result: returnedInfoType = {
      pass: true,
      message: "Something is wrong",
      status: 400,
      uploadedFilesNames: [],
      rejectedFiles: [],
      error: "",
    };
    if (!file) {
      result.pass = false;
      result.error = "No files selected!";

      reject(result);
    }
    try {
      const formData = new FormData();

      const validation = checkFile(file, fileSizeLimit, onlyMedia);
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

      // this overwrites entier result you should do it wiht const instead of let somehow
      // The response retruned to the user
      result = await response.json();

      resolve(result);

      // there is type of any on error check if you can do something about it.
    } catch (e: any) {
      console.error("error happened: ", e);

      result.error =
        "Something went wrong! We got unusual error. Probably server";

      result.pass = false;
      reject(result);
    }
  });
}
