import {
  ChangeEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { DropzonePreviewCard } from "./DropZoneFilesPreview";
import { checkFile } from "@/_lib/file-upload/file-upload-frontend";
import { FILES_MAX_AMOUNT } from "@/_lib/file-upload/config";
import { returnedInfoType } from "@/_types/fileUploadTypes";

// TODOS!!!:
// for now there is no todos here sheesh

const ONLY_MEDIA_ALLOWED: boolean =
  process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

const DropZone = ({
  result,
  setResult,
  files,
  setFiles,
}: {
  result: returnedInfoType;
  setResult: React.Dispatch<SetStateAction<returnedInfoType>>;
  files: Array<File>;
  setFiles: React.Dispatch<SetStateAction<Array<File>>>;
}) => {
  const [dragging, setDragging] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkFilesLocal = (newFiles: Array<File>) => {
    setResult((prevState) => {
      return {
        ...prevState,
        uploadedFilesNames: [],
        rejectedFiles: [],
        error: "",
        pass: true,
      };
    });
    const localRejectedFiles: Array<{ fileName: string; reason: string }> = [];

    if (!newFiles || newFiles.length === 0) {
      setResult((prevState: returnedInfoType) => {
        return {
          ...prevState,
          error: "No files selected!",
          pass: false,
        };
      });
      return false;
    }

    if (newFiles.length > FILES_MAX_AMOUNT) {
      setResult((prevState) => ({
        ...prevState,
        error: `Too many files! Max allowed amount is: ${FILES_MAX_AMOUNT}`,
      }));
      return false;
    }

    newFiles.forEach((file) => {
      const validation = checkFile(file);
      if (validation === true) {
        return true;
      }
      localRejectedFiles.push(validation);
    });

    if (localRejectedFiles.length === 0) return true;

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

      newFiles = newFiles.filter((file) => !rejectedFileNames.has(file.name));
      if (newFiles.length === 0) return false;
      setFiles((prev: Array<File>) => [...prev, ...newFiles]);

      return false;
    }
  };

  // this function is responsible for saving the files to the input
  const syncAndValidateFilesInput = (newFiles: Array<File>) => {
    if (!fileInputRef.current) return;
    if (!newFiles || newFiles.length === 0) return;

    const resultOfChecking = checkFilesLocal(newFiles);
    if (resultOfChecking !== true) {
      return;
    }

    const dataTransfer = new DataTransfer();

    newFiles.forEach((file) => dataTransfer.items.add(file));

    fileInputRef.current.files = dataTransfer.files;
    setFiles((prev) => [...prev, ...newFiles]);
  };

  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => prev + 1);
      setDraggingWindow(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => {
        const newCount = prev - 1;
        if (newCount <= 0) setDraggingWindow(false);
        return newCount;
      });
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter(0);
      setDraggingWindow(false);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) =>
      prev.filter((_, index: number) => index !== indexToRemove),
    );
  };

  // aren't we listening for this anyway check if this is the right way or don't we will see

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }
    const inputFiles = Array.from(e.target.files);

    syncAndValidateFilesInput(inputFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(0);
    setDraggingWindow(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    syncAndValidateFilesInput(droppedFiles);
  };

  return (
    <div>
      <label>
        <div
          id="dropzone"
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors border-green-400
             ${draggingWindow ? "bg-[#162E93]" : ""} cursor-pointer`}
          onDrop={(e) => handleDrop(e)}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            name="files"
            onChange={handleFilesChange}
            hidden
            accept={ONLY_MEDIA_ALLOWED ? "image/*,video/*" : "/*"}
          />
          <h2>
            {draggingWindow
              ? "Drop your files here!"
              : "You can drop your files here to upload them"}
          </h2>
        </div>
      </label>
      <div id="dropzone-files-preview">
        {files.length > 0
          ? files.map((file, index) => (
              <DropzonePreviewCard
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))
          : ""}
      </div>
    </div>
  );
};

export default DropZone;
