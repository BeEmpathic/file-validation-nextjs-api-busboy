import { useState, useEffect } from "react";
function DropzonePreviewCard({ file }: { file: File }) {
  const [preview, setPreview] = useState<string | Blob | undefined>("");
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isImage]);

  return (
    <div className="w-100">
      {preview ? (
        <img src={preview} alt={file.name} className="size-full" />
      ) : (
        ""
      )}
    </div>
  );
}
function DropzonePreview({ files }: { files: Array<File> }) {}
