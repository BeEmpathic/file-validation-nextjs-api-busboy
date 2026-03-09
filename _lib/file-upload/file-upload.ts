export async function fileUpload(files: File[]) {
  let result = {
    message: ["Empty result, something wen't wrong!"],
    success: false,
    error: "No errors, yet",
  };

  if (files.length === 0) {
    result.message = ["No files detected something is off"];

    return result;
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/test", {
      method: "POST",
      body: formData,
    });

    console.log("Raw response:", response);

    if (!response.ok) {
      if (response.status === 413) {
        result.message = ["The total size of the files is too large"];
        return result;
      }

      result.message = ["Something is wrong with the respone"];
      return result;
    }
    // this overwrites entier resultat you should do it wiht const instead of let somehow
    result = await response.json();
    // The response retruned to the user

    return result;

    // there is type of any on error check if you can do something about it.
  } catch (e: any) {
    console.error(e);
    result.message = ["Something went wrong! We got unusual error"];
    result.error = e;
    result.success = false;
    return result;
  }
}
