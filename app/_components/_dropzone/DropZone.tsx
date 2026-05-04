import { ChangeEvent, useState } from "react";
import { DropzonePreviewCard } from "./DropZoneFilesPreview";

const DropZone = ({ files, setFiles }) => {
  // this doesn't work for some reason
  const removeFile = (indexToRemove: number) => {
    setFiles((prev) =>
      prev.filter((_, index: number) => index !== indexToRemove),
    );
  };

  // aren't we listening for this anyway check if this is the right way or don't we will see
  const [dragging, setDragging] = useState(false);

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }
    // make so validation happens on change instead of on submit
    setFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
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
          className={`border-2 border-dashed border-green-400 rounded-lg p-12 text-center cursor-pointer transition-colors`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
