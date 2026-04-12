import { returnedInfoType } from "@/_types/fileUploadTypes";

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
      reason: `Is too large only ${fileSizeLimit} allowed`,
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
  let result: returnedInfoType = {
    pass: true,
    message: "Something is wrong",
    status: 400,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "",
  };
  if (files.length === 0) {
    result.error = "No files selected!";

    return result;
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      const validation = checkFile(file, fileSizeLimit, onlyMedia);
      if (validation === true) {
        formData.append("files", file);
      } else {
        result.rejectedFiles.push(validation);
        result.pass = false;
        result.error = "Problem with the files";
      }
    });
    // check if there was no errors / i did set the result.pass to false if so return result hopefully wtih some error
    if (!result.pass) {
      return result;
    }

    const response = await fetch("/api/file-upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return result;
    }

    // this overwrites entier resultat you should do it wiht const instead of let somehow
    // The response retruned to the user
    result = await response.json();

    return result;

    // there is type of any on error check if you can do something about it.
  } catch (e: any) {
    console.log("error happened: ");
    console.error(e);
    result.error =
      "Something went wrong! We got unusual error. Probably server";

    result.pass = false;
    return result;
  }
}
