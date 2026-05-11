import { useState, useEffect } from "react";

// TODOS !!!!!!!!!!!! Here comes more todos:
// - Make so the images looks like printed photos from that fun camera
// - Add font which looks like a marker and make so the name and the size are written with it

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
    <div className="border my-5 p-5 rounded-lg bg-sky-500">
      <div className="bg-white p-5 relative aspect-square overflow-hidden rounded-t-lg ">
        {preview && (
          <img
            src={preview}
            alt={file.name}
            className="inset-0 size-full object-cover aspect-square"
          />
        )}

        <button
          className="outline-1 outline-black hover:bg-[rgba(255,0,0,0.5)] w-[3rem] aspect-square font-bold flex items-center justify-center absolute top-1 right-1 rounded-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          X
        </button>
      </div>
      <div className="bg-white p-5 text-black font-black">
        <h1 className="text-4xl">{file.name}</h1>
        <h2 className="text-gray-800">
          {Math.round(file.size / 1024 / 1024)} MB
        </h2>
      </div>
    </div>
  );
}
