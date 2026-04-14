"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Page() {
  // doing the variables for files being stored in one place / .env file

  // Do the loading state and the css for this page not much work but you should do it it's going to be easy and fun
  // maybe do that the uploaded files amount is set in the enviromental variable so you don't have to do it separetly for backend and frontend
  // do the totall amount on client side if it's needed technically somebody cannot skip it cause he would have to make a file bigger than the file limit
  // learn how to have this same variable for backend and frontend without exposing anything

  const initialResult: returnedInfoType = {
    pass: false,
    message: "No files selected",
    status: 400,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "",
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
    // variables for the limits from env processed
    const FILES_MAX_AMOUNT: number = process.env.NEXT_PUBLIC_MAX_FILES_AMOUNT
      ? parseInt(process.env.NEXT_PUBLIC_MAX_FILES_AMOUNT, 10)
      : 10;
    const FILE_MAX_SIZE = process.env.NEXT_PUBLIC_MAX_FILE_SIZE
      ? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE, 10) * 1024 * 1024
      : 5 * 1024 * 1024; // in MB

    const ONLY_MEDIA_ALLOWED: boolean =
      process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

    event.preventDefault();

    const response: returnedInfoType = await fileUpload(
      files,
      FILES_MAX_AMOUNT,
      FILE_MAX_SIZE,
      ONLY_MEDIA_ALLOWED,
    );
    setResult(response);
  }

  return (
    <div className="border">
      <form onSubmit={onSubmit}>
        <input type="file" multiple name="files" onChange={handleFilesChange} />
        <button className="cursor-pointer border-solid" type="submit">
          Submit
        </button>

        <div id="result">
          {result.error ? (
            <div className="text-red-500">{result.error}</div>
          ) : (
            result.message
          )}
          {result.rejectedFiles
            ? result.rejectedFiles.map((rejectedFile, index: number) => (
                <div className="text-red-500" key={index}>
                  {rejectedFile.fileName} {rejectedFile.reason}
                </div>
              ))
            : null}

          {result.uploadedFilesNames
            ? result.uploadedFilesNames.map(
                (fileName: string, index: number) => (
                  <div key={index}>{fileName} Uploaded successfully</div>
                ),
              )
            : null}
          {}
        </div>
      </form>
    </div>
  );
}
