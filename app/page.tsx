"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Page() {
  // make it so it's just an property / object on the result

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
    const fileSizeLimit: number = 5 * 1024 * 1024;
    const onlyMedia: boolean = true;
    event.preventDefault();

    const response: returnedInfoType = await fileUpload(
      files,
      fileSizeLimit,
      onlyMedia,
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
