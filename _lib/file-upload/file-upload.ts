import { returnedInfoType } from "@/_types/fileUploadTypes";

function checkFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return false;
  }
  if (!file.type.startsWith("image") || !file.type.startsWith("video")) {
    return false;
  }
  return true;
}

export async function fileUpload(files: File[]) {
  const rejectedFiles: string[] = [];
  let result: returnedInfoType = {
    pass: false,
    message: "",
    status: 400,
    uploadedFilesNames: [],
    error: "No files selected",
  };

  if (files.length === 0) {
    result.error = "No files selected";

    return result;
  }

  files.forEach((file) => {
    if (!checkFile(file)) {
      rejectedFiles.push(file.name);
    }
  });
  if (rejectedFiles.length > 0) {
    result.uploadedFilesNames = rejectedFiles;
    return result;
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/file-upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log("Response not ok check", response);
      return result;
    }

    console.log("Raw response:", response);

    result = await response.json();

    console.log(result);

    // this overwrites entier resultat you should do it wiht const instead of let somehow
    // The response retruned to the user
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
