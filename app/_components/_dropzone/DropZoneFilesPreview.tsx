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
    <div className="relative aspect-square m-4 overflow-hidden rounded-lg border">
      {preview && (
        <img
          src={preview}
          alt={file.name}
          className="inset-0 size-full object-cover aspect-square"
        />
      )}

      <button
        className="hover:bg-[rgba(100,0,0,0.9)] h-1/15 flex aspect-square border border-grey-900 items-center justify-center absolute top-1 right-1 rounded-full cursor-pointer"
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
