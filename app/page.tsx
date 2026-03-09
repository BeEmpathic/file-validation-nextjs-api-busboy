"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Page() {
  // make it so it's just an property / object on the result
  //  containing the messsage which is array of strings
  // instead of this what you have now
  const initialResult = { message: ["No files send yet"], success: true };

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
    const response = await fileUpload(files);
    setResult(response);
    console.log("The result", result);

    console.log("Result message:", result.message);

    console.log(files);
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="file" multiple name="files" onChange={handleFilesChange} />
      <button className="cursor-pointer border-solid" type="submit">
        Submit
      </button>

      {
        <div id="result">
          {result.message}
          {/* {Object.keys(result).length > 0 ? (
            result.map((obj) => <p key={index}>{message}</p>)
          ) : (
            <p>No files added yet</p>
          )} */}
        </div>
      }
    </form>
  );
}
