import { ChangeEvent, useState, useEffect } from "react";
import { DropzonePreviewCard } from "./DropZoneFilesPreview";

// rework everything so it works on window instead of only the dropZone area

const DropZone = ({ files, setFiles }) => {
  const [dragging, setDragging] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState(false);

  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDraggingWindow(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
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
    // make so validation happens on change instead of on submit
    setFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true);
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  function handleDragLeave() {
    setDragging(false);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);

    console.log("The dropped files: ", droppedFiles);
  };

  return (
    <div>
      <label>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors border-green-400 ${draggingWindow ? "bg-[#162E93]" : ""}`}
          onDragOver={(e) => handleDragOver(e)}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={() => handleDragLeave()}
          onDrop={(e) => handleDrop(e)}
        >
          <input
            type="file"
            multiple
            name="files"
            onChange={handleFilesChange}
            hidden
          />
          <h2>Here will be a dropzone</h2>
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
