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
    <div className="w-100">
      {preview ? (
        <img src={preview} alt={file.name} className="size-full" />
      ) : (
        ""
      )}

      <button
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
