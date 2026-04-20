"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import { ChangeEvent, useTransition, useState, startTransition } from "react";
import DisplayResult from "./_components/DisplayResult";

export default function Page() {
  // Do the loading state and the css for this page not much work but you should do it it's going to be easy and fun
  // maybe do file types on the backend
  const initialResult: returnedInfoType = {
    pass: false,
    message: "Feed me the files!",
    status: 400,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "",
  };

  const [result, setResult] = useState(initialResult);
  const [files, setFiles] = useState<File[]>([]);

  const [isPending, startTransition] = useTransition();

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    setResult(initialResult);
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }

    setFiles(Array.from(e.target.files));
  }

  async function onSubmit() {
    startTransition(async () => {
      // variables for the limits from env processed
      const FILES_MAX_AMOUNT: number = process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT
        ? parseInt(process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT, 10)
        : 10;
      const FILE_MAX_SIZE = process.env.NEXT_PUBLIC_FILE_MAX_SIZE
        ? parseInt(process.env.NEXT_PUBLIC_FILE_MAX_SIZE, 10) * 1024 * 1024
        : 5 * 1024 * 1024; // in MB

      const ONLY_MEDIA_ALLOWED: boolean =
        process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

      console.log(FILE_MAX_SIZE);
      console.log(process.env.NEXT_PUBLIC_FILE_MAX_SIZE);
      const response: returnedInfoType = await fileUpload(
        files,
        FILES_MAX_AMOUNT,
        FILE_MAX_SIZE,
        ONLY_MEDIA_ALLOWED,
      );
      setResult(response);
    });
  }

  return (
    <div className="border">
      <form action={onSubmit}>
        <input type="file" multiple name="files" onChange={handleFilesChange} />
        <button
          disabled={isPending}
          className="cursor-pointer border-solid"
          type="submit"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
      <DisplayResult result={result} />
    </div>
  );
}
