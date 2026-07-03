"use client";
import { fileUpload, checkFile } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import { ChangeEvent, useTransition, useState, useEffect } from "react";
import DisplayResult from "./_components/DisplayResult";
import DropZone from "./_components/_dropzone/DropZone";
import ScrollTopButton from "./_components/ScrollTopButton";
import { FILES_MAX_AMOUNT } from "@/_lib/file-upload/config";

const Page = () => {
  // ENDLESS TODOS LIST!!!!!!!!!!!!:

  // - clean the code a bit in the main page I think you can move the onChange function th the file-upload-frontend.ts something like this
  // just I guess work on this app for another month xD

  // - undestand how the dropzone works againg, done but you didn't do any modifcations cause it looks good

  // - learn the testing library on this project

  // - maybe do so the env is an contextProivder

  // - Add UUID to your files cause that will help with everything related to them in the frontend (That means rebulding entire app ;-;)

  // - Past the result and setResult to the file-upload-frontend.ts it should make it more smooth

  // - Maybe make so the design isn't that big, the files are kind of big and there is a lot of scrolling there maybe make them smaller, or fuck it's good for the phones

  // - You have to chunk the files good luck mate!!! Thats my main goal right now

  // - disable the upload button if the file isn't matching the validatoin so you probably you had this good idea, the frontend validation should happen before pressing the button I guess ;-;

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

  // validation before the files are uploaded
  useEffect(() => {
    const localRejectedFiles: Array<{ fileName: string; reason: string }> = [];

    if (!files || files.length === 0) {
      return;
    }

    if (files.length > FILES_MAX_AMOUNT) {
      setResult((prevState) => ({
        ...prevState,
        error: `Too many files! Max allowed amount is: ${FILES_MAX_AMOUNT}`,
      }));
      return;
    }

    files.forEach((file) => {
      const validation = checkFile(file);
      if (validation === true) {
        return;
      }
      localRejectedFiles.push(validation);
    });

    if (localRejectedFiles.length === 0) {
      setResult((prevState) => ({
        ...prevState,
      }));
      return;
      // make it so it does set the pass flag in the result to true and check why you even put such a flag there xD
    }

    setResult((prevState) => ({
      ...prevState,
      rejectedFiles: localRejectedFiles,
      error: "File didn't pass validation!",
      pass: false,
    }));

    if (localRejectedFiles.length > 0) {
      const rejectedFileNames = new Set(
        localRejectedFiles.map((file) => file.fileName),
      );

      setFiles((prevState) =>
        prevState.filter((file) => !rejectedFileNames.has(file.name)),
      );
    }
  }, [files]);

  const onSubmit = async () => {
    startTransition(async () => {
      setResult(initialResult);

      try {
        // rise your knowledge about promises in javascript, cause you need to use promise all here to get the correct result or something
        const response = await fileUpload(files);
        setResult((prevState) => ({
          ...prevState,
          message: response.message,
          status: response.status,
          uploadedFilesNames: [
            ...prevState.uploadedFilesNames,
            ...response.uploadedFilesNames,
          ],
          rejectedFiles: response.rejectedFiles,
          error: response.error,
        }));
      } catch (err: any) {
        if (err && err.error) {
          setResult((prevState) => ({
            ...prevState,
            message: err.message,
            status: err.status,
            rejectedFiles: [...prevState.rejectedFiles, ...err.rejectedFiles],
            error: err.error,
          }));
        }
      }

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
