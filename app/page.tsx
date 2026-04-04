"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Page() {
  // make it so it's just an property / object on the result
  //  containing the messsage which is array of strings
  // instead of this what you have now

  type returnedInfoType = {
    pass: boolean;
    message: string;
    status: number;
    uploadedFilesNames: string[];
    error: string;
  };
  const initialResult: returnedInfoType = {
    pass: false,
    message: "",
    status: 400,
    uploadedFilesNames: [],
    error: "No files selected",
  };

  const [result, setResult] = useState(initialResult);
  const [files, setFiles] = useState<File[]>([]);
  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }

    setFiles(Array.from(e.target.files));
  }

  async function onSubmit(event: any) {
    event.preventDefault();
    const response: returnedInfoType = await fileUpload(files);
    setResult(response);
    console.log("The result: ", result);

    console.log("Result message: ", result.message);

    console.log(files);
  }

  return (
    <div className="border">
      <form onSubmit={onSubmit}>
        <input type="file" multiple name="files" onChange={handleFilesChange} />
        <button className="cursor-pointer border-solid" type="submit">
          Submit
        </button>

        {
          <div id="result">
            {result ? result.message : "No files send yet"}
            {/* {Object.keys(result).length > 0 ? (
            result.map((obj) => <p key={index}>{message}</p>)
            ) : (
              <p>No files added yet</p>
              )} */}
          </div>
        }
      </form>
    </div>
  );
}
