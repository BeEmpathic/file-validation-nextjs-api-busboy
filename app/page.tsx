"use client";
import { fileUpload, checkFile } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import {
  ChangeEvent,
  useTransition,
  useState,
  useEffect,
  useActionState,
} from "react";
import DisplayResult from "./_components/DisplayResult";
import DropZone from "./_components/_dropzone/DropZone";
import ScrollTopButton from "./_components/ScrollTopButton";

const Page = () => {
  // ENDLESS TODOS LIST!!!!!!!!!!!!:

  // - clean the code a bit in the main page I think you can move the onChange function th the file-upload-frontend.ts something like this
  // just I guess work on this app for another month xD

  // - Check if the returnedInfoTyep which could be called the fileuploadresult is used where it's supposed to be used

  //  Use action state is not good here, cause it requires you to manage the result only on submit

  // - Delete the rest of the user's files name at save

  // - Add UUID to your files cause that will help with everything related to them in the frontend (That means rebulding entire app ;-;)

  // - Past the result and setResult to the file-upload-frontend.ts it should make it more smooth

  // - Maybe make so the design isn't that big, the files are kind of big and there is a lot of scrolling there maybe make them smaller, or fuck it's good for the phones

  // - You have to chunk the files good luck mate!!! That's some next level type shit to do

  // - maybe do file types on the backend
  // sooo yeah just found a bug before even getting to use this and now we are reworking this shit again so yeah here I go again endless project remember
  // I'm suppose to never stop developing this I guess
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
        setFiles([]);
        return;
      } catch (err: any) {
        if (err && err.error) {
          setResult((prevState) => ({
            ...prevState,
            message: err.message,
            status: err.status,
            rejectedFiles: [...prevState.rejectedFiles, ...err.rejectedFiles],
            error: err.error,
          }));
          setFiles([]);
          return;
        }
      }
    });
  };

  return (
    <div className="font-meri bg-[#1A1953] flex min-h-dvh flex justify-center items-center p-8">
      <div className="bg-[#2F2FE4] w-full rounded-lg file-upload-form flex flex-col p-8 max-w-2xl content-center">
        <form action={onSubmit} className="text-center p-3">
          <DropZone
            result={result}
            setResult={setResult}
            files={files}
            setFiles={setFiles}
          />
          {/* drop zone is an input now make it work ahahahahahah */}
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
