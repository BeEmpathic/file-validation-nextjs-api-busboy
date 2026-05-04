"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import { ChangeEvent, useTransition, useState, startTransition } from "react";
import DisplayResult from "./_components/DisplayResult";
import DropZone from "./_components/_dropzone/DropZone";

export default function Page() {
  // swap all functions to consts cause it should be better to use ;-; I kind of wish I didn't learn that ;-;
  // - you broke your result clean up ;-; but I think you should leave it for later
  // - Dropezone to do
  // - Make so the files from the input and the files from the droping are stored in a variable / array and just pass it to the frontend sender
  // - go and cry cause suddenly this project is fucking endlesss ;-;
  // - Maske so the files are rejected before clicking the upload button
  // / disable the upload button if the file isn't matching the validatoin so you probably have to extract the validation now hahah
  // - The css for this page not much work but you should do it it's going to be easy and fun
  // make so validation happens on change instead of on submit
  // - maybe do file types on the backend
  // why I'm adding todos instead of deleting them ;-;

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
    <div className="bg-[#1A1953] size-full h-dvh flex justify-center items-center p8">
      <div className="bg-[#2F2FE4] w-full rounded-lg file-upload-form flex flex-col border p-8 max-w-2xl content-center">
        <form className="text-center border p-3" action={onSubmit}>
          <DropZone files={files} setFiles={setFiles} />
          {/*<!-- this dropzone has an input in it */}
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
    </div>
  );
}
