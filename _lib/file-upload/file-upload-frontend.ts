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

  const uploadPromises = files.map(async (file) => {
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

      return backendData;
    } catch (error: any) {
      console.error("error happened: ", error);
      return result;
    }
  });

  const uploadResults = await Promise.all(uploadPromises);

  for (const item of uploadResults) {
    if (item.status === 201) {
      result.message = item.message;
      result.status = item.status;
      result.pass = true;

      if (item.uploadedFilesNames && item.uploadedFilesNames[0]) {
        result.uploadedFilesNames.push(item.uploadedFilesNames[0]);
      }
    } else {
      result.message = item.message;
      result.status = item.status;
      result.error = item.error;

      if (item.rejectedFile) {
        result.rejectedFiles.push(item.rejectedFile);
      }
    }
  }

  if (!result.pass) {
    return Promise.reject(result);
  }
  return result;
}
