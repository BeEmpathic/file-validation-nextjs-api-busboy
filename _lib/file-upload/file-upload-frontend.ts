"use client";
import { returnedInfoType } from "@/_types/fileUploadTypes";
import {
  FILES_MAX_AMOUNT,
  FILE_MAX_SIZE,
  ONLY_MEDIA_ALLOWED,
} from "@/_lib/file-upload/config";

export const checkFile = (
  file: File,
  filesAmount: number = FILES_MAX_AMOUNT,
  fileSizeLimit: number = FILE_MAX_SIZE,
  onlyMedia: boolean = ONLY_MEDIA_ALLOWED,
):
  | {
      fileName: string;
      reason: string;
    }
  | true => {
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
};

export async function fileUpload(files: File[]) {
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

    return result;
  }

  const uploadPrimises = files.map(async (file) => {
    const validation = checkFile(file);

    if (validation !== true) {
      result.rejectedFiles.push(validation);
      result.error = "File didn't pass validation!";
      result.pass = false;

      return result;
    }

    const formData = new FormData();

    formData.append("file", file);
    try {
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return result;
      }
      const backendData = await response.json();
      if (backendData.error) {
        result.message = backendData.message;
        result.pass = backendData.pass;
        result.error = backendData.error;
        result.status = backendData.status;
      }

      return result;
    } catch (error: any) {
      return error;
    }
  });

  for (const file of files) {
    try {
      const validation = checkFile(file);
      if (validation === true) {
      } else {
        result.rejectedFiles.push(validation);
        result.error = "File didn't pass validation!";
        result.pass = false;
      }
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return result;
      }
      const backendData = await response.json();
      if (backendData.error) {
        result.message = backendData.message;
        result.pass = backendData.pass;
        result.error = backendData.error;
        result.status = backendData.status;
      }

      result.message = backendData.message;
      result.pass = backendData.pass;
      result.status = backendData.status;

      result.uploadedFilesNames.push(backendData.uploadedFilesNames[0]);
      result.rejectedFiles.push(backendData.rejectedFiles);
    } catch (e: any) {
      console.error("error happened: ", e);

      result.error =
        "Something went wrong! We got unusual error. Probably server";

      result.pass = false;
      return result;
    }
  }

  if (!result.pass) {
    console.log("the result.pass wasn't true");
    return result;
  }

  // there is type of any on error check if you can do something about it.

  return result;
}
