import { ChangeEvent, useState } from "react";
export default function DropZone({ files, setFiles }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState(filesFromInput);

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }
    // make so validation happens on change instead of on submit
    setFiles(Array.from(e.target.files));
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDragEnter(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);

    console.log("The dropped files: ", droppedFiles);
  }

  return (
    <div
      className="border"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" multiple name="files" onChange={handleFilesChange} />
      <h2>Here will be a dropzone</h2>
    </div>
  );
}
