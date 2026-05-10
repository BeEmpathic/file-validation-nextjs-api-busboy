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
    <div className="border my-5 rounded-lg bg-sky-500">
      <div className="bg-white p-5 relative aspect-square m-4 overflow-hidden rounded-lg ">
        {preview && (
          <img
            src={preview}
            alt={file.name}
            className="inset-0 size-full object-cover aspect-square"
          />
        )}

        <button
          className="hover:bg-[rgba(255,0,0,0.5)] w-[3rem] aspect-square font-bold flex border border-grey-900 items-center justify-center absolute top-1 right-1 rounded-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          X
        </button>
      </div>
      <div>
        <p>{file.name}</p>
        <p>{Math.round(file.size / 1024 / 1024)} MB</p>
      </div>
    </div>
  );
}
