"use client";
import { fileUpload, checkFile } from "@/_lib/file-upload/file-upload-frontend";
import { returnedInfoType } from "@/_types/fileUploadTypes";

import { ChangeEvent, useTransition, useState, useEffect } from "react";
import DisplayResult from "./_components/DisplayResult";
import DropZone from "./_components/_dropzone/DropZone";
import ScrollTopButton from "./_components/ScrollTopButton";

const Page = () => {
  // ENDLESS TODOS LIST!!!!!!!!!!!!:

  // - Make so it auto deleteds / filters the file which didn't pass the validation
  // - Past the result and setResult to the file-upload-frontend.ts it should make it more smooth
  // - Make so the files are rejected before clicking the upload button
  // - fix mp4 files upload, maybe you turned off the server and then tried to youload so this is why it crashed
  // - Make so the files start to upload instanly after you add them

  // - You have to chunk the files good luck mate!!! Thats my main goal right now
  // - disable the submit button if the files doesn't pass the validation
  // - disable the upload button if the file isn't matching the validatoin so you probably you had this good idea, the frontend validation should happen before pressing the button I guess ;-;
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

  useEffect(() => {
    setResult(initialResult);
    if (!files || files.length === 0) {
      return;
    }
    files.forEach((file) => {
      const validation = checkFile(file);
      if (validation === true) {
        return;
      } else {
        setResult((prevState) => ({
          ...prevState,
          rejectedFiles: [...prevState.rejectedFiles, validation],
          error: "File didn't pass validation!",
        }));
        result.rejectedFiles.push(validation);
        result.error = "File didn't pass validation!";
        result.pass = false;
      }
    });
  }, [files]);

  useEffect(() => {
    if (!files || files.length === 0) {
      return;
    }
    setFiles((prevState) => {
      console.log("How the prevState looks like:", prevState);
      console.log(
        "The rejected files in the second useEffect",
        result.rejectedFiles,
      );
      return {
        ...prevState.filter(
          (file, index) => result.rejectedFiles[0].fileName !== file.name,
        ),
      };
    });
  }, [result]);

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
