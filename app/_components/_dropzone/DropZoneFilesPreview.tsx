import { useState, useEffect } from "react";
export function DropzonePreviewCard({
  file,
  onRemove,
}: {
  file: File;
  onRemove: void;
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

// for now this is kind of useless but I think it makes sense to use it,
//  so this is a div with the cards not just cards showing up in a random place
function DropzonePreview({ files }: { files: Array<File> }) {}
