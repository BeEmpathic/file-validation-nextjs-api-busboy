import { useState, useEffect } from "react";

// TODOS !!!!!!!!!!!! Here comes more todos:
// - Make it so when the file is PDF, TXT, DOC, XLS it has an icon of a file
// - Make remove button and SVG so it looks way better, or maybe fucking look for job instead of doing some endless project which isn't even targeted to have any users
// - Maybe make so when you press the image remove button it changes color to red it might make it look better on the phones

const DropzonePreviewCard = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const [preview, setPreview] = useState<string | Blob | undefined>("");
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isImage]);

  return (
    <div className="my-5 p-5 rounded-lg bg-sky-500">
      <div className="bg-white p-5 relative aspect-square overflow-hidden rounded-t-lg ">
        {preview ? (
          <img
            src={preview}
            alt={file.name}
            className="outline-solid inset-0 size-full object-cover aspect-square"
          />
        ) : (
          ""
        )}
        {/* change this */}
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
      <div className="max-w-full bg-white p-5 text-black font-black">
        <h1 className="p-3 break-all text-4xl">{file.name}</h1>
        <h2 className="text-gray-800">
          {Math.round((file.size / 1024 / 1024) * 100) / 100} MB
        </h2>
      </div>
    </div>
  );
};

export { DropzonePreviewCard };
