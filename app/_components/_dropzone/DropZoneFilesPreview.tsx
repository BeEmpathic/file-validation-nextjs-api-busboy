import { useState, useEffect } from "react";
export function DropzonePreviewCard({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | Blob | undefined>("");
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isImage]);

  return (
    <div className="relative w-full max-w-[200px] aspect-square overflow-hidden rounded-lg border">
      {preview && (
        <img
          src={preview}
          alt={file.name}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      <button
        className="absolute top-1 right-1 p-1 rounder-full cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
      >
        X
      </button>
    </div>
  );
}
