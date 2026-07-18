import {
  ChangeEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { DropzonePreviewCard } from "./DropZoneFilesPreview";

// TODOS!!!:
// - Rework the entire dropzone

const ONLY_MEDIA_ALLOWED: boolean =
  process.env.NEXT_PUBLIC_ONLY_MEDIA_ALLOWED === "true" || false;

const DropZone = () => {
  const [dragging, setDragging] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncFilesInput = (newFiles: Array<File>) => {
    if (!fileInputRef.current) return;

    const dataTransfer = new DataTransfer();

    newFiles.forEach((file) => dataTransfer.items.add(file));

    fileInputRef.current.files = dataTransfer.files;
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

    setFiles((prev) => [...prev, ...inputFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(0);
    setDraggingWindow(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);

    console.log("The dropped files: ", droppedFiles);
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
