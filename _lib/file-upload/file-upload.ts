import { returnedInfoType } from "@/_types/fileUploadTypes";

function checkFile(file: File):
  | {
      fileName: string;
      reason: string;
    }
  | true {
  if (file.size > 5 * 1024 * 1024) {
    return { fileName: file.name, reason: "Is too large only 5MB allowed" };
  }
  if (!file.type.startsWith("image") || !file.type.startsWith("video")) {
    return {
      fileName: file.name,
      reason:
        "It isn't an image or video, wrong file type only png, jpg, mp4 itp.",
    };
  }
  return true;
}

export async function fileUpload(files: File[]) {
  let result: returnedInfoType = {
    pass: false,
    message: "",
    status: 400,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "No files selected",
  };
  console.log("Files in the fileupload function", files);
  if (files.length === 0) {
    console.log(files);
    result.error = "No files selected!";

    return result;
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      const validation = checkFile(file);
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
      console.log("Response not ok check", response);
      return result;
    }

    console.log("Raw response:", response);
    // this overwrites entier resultat you should do it wiht const instead of let somehow
    // The response retruned to the user
    result = await response.json();

    console.log(result);

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
