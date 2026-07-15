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
import { FILES_MAX_AMOUNT } from "@/_lib/file-upload/config";

const Page = () => {
  // ENDLESS TODOS LIST!!!!!!!!!!!!:

  // - Make so the errors are cleared with every upload of the files

  // - rework the useEffects instead of making the dropzone save the files make so the dropzone returns files to you and then deal with them <3

  // - rework the useTranstion to be useActionState and see what's gonna happen

  // - clean the code a bit in the main page I think you can move the onChange function th the file-upload-frontend.ts something like this
  // just I guess work on this app for another month xD

  // - when there is an error with the file it doesn't clear the successfully uploaded files and I'm not sure if that's bad or good

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
  const [startTransition] = useTransition();

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

    // this doesn't work cause I need to rework the entire fucking useEffect omg xD These to things are so huge
    if (localRejectedFiles.length === 0) {
      setResult((prevState) => ({
        ...prevState,
        rejectedFiles: [],
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
    setResult(initialResult);

    try {
      // rise your knowledge about promises in javascript, cause you need to use promise all here to get the correct result or something
      const response = await fileUpload(files);
      console.log("What is in the respone:", response);
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
      console.log("Did you error?", console.log(err));
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
  };

  const [serverResult, formAction, isPending] = useActionState(
    onSubmit,
    initialResult,
  );

  console.log("What the hell is server result?", serverResult);

  return (
    <div className="font-meri bg-[#1A1953] flex min-h-dvh flex justify-center items-center p-8">
      <div className="bg-[#2F2FE4] w-full rounded-lg file-upload-form flex flex-col p-8 max-w-2xl content-center">
        <form action={formAction} className="text-center p-3">
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
