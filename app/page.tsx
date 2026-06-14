"use client";
import { fileUpload } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import { ChangeEvent, useTransition, useState, useEffect } from "react";
import DisplayResult from "./_components/DisplayResult";
import DropZone from "./_components/_dropzone/DropZone";
import ScrollTopButton from "./_components/ScrollTopButton";

const Page = () => {
  // ENDLESS TODOS LIST!!!!!!!!!!!!:
  // - Make so you get the result correctly now you don't get it at all I mean that the over all
  //  error message isn't showing up I don't know if you show why a file is not good
  // - Make so the files start to upload instanly after you add them
  // - you deleted the file amount check get it back later
  // - You have to chunk the files good luck mate!!! Thats my main goal right now
  // - Make so the files are rejected before clicking the upload button
  // - disable the submit button if the files doesn't pass the validation
  // - disable the upload button if the file isn't matching the validatoin so you probably have to extract the validation now hahah
  // - make so validation happens on change instead of on submit
  // - maybe do file types on the backend
  // why I'm adding todos instead of deleting them ;-; (Good question ;-;, but you deleted some from other files :) )

  const initialResult: returnedInfoType = {
    pass: false,
    message: "Your files's feedback will be here!",
    status: 400,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "",
  };

  const [result, setResult] = useState(initialResult);
  const [files, setFiles] = useState<File[]>([]);

  const [isPending, startTransition] = useTransition();

  const onSubmit = async () => {
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

      // make it const

      const uploadedFiles = [];
      const rejectedFiles = [];
      for (const file of files) {
        try {
          const response = await fileUpload(
            file,
            FILE_MAX_SIZE,
            ONLY_MEDIA_ALLOWED,
          );
          if (!response.error)
            uploadedFiles.push(response.uploadedFilesNames[0]);
          if (response.error) rejectedFiles.push(response.rejectedFiles[0]);
          console.log(response);
        } catch (err) {
          console.error(err);
          result.error = "Something went wrong, maybe try again?";
        }
      }
      const response = initialResult;
      response?.uploadedFilesNames.push(...uploadedFiles);
      // response?.rejectedFiles.push(...rejectedFiles);

      setResult(response);
      console.log("The response:", response);

      setFiles([]);
    });
  };

  return (
    <div className="font-meri bg-[#1A1953] flex min-h-dvh flex justify-center items-center p-8">
      <div className="bg-[#2F2FE4] w-full rounded-lg file-upload-form flex flex-col p-8 max-w-2xl content-center">
        <form action={onSubmit} className="text-center p-3">
          <DropZone files={files} setFiles={setFiles} />
          {/*<!-- this dropzone has an input in it */}
          <button
            disabled={isPending}
            className="cursor-pointer text-black bg-white p-2 m-2 rounded-full hover:bg-gray-300 hover:text-white"
            type="submit"
          >
            {isPending ? "Uploading..." : "Upload!"}
          </button>
        </form>
        <DisplayResult result={result} />
      </div>
      <ScrollTopButton />
    </div>
  );
};

export default Page;
