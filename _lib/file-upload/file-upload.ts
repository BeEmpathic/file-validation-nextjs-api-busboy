export async function fileUpload(files: File[]) {
  let result: {
    message: string[] | undefined;
    success: boolean;
  } = {
    message: ["Empty result, something wen't wrong!"],
    success: false,
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

    // this overwrites entier resultat you should do it wiht const instead of let somehow
    // The response retruned to the user
    return result;

    // there is type of any on error check if you can do something about it.
  } catch (e: any) {
    console.log("error happened: ");
    console.error(e);
    result.message = [
      "Something went wrong! We got unusual error. Probably server",
    ];

    result.success = false;
    return result;
  }
}
