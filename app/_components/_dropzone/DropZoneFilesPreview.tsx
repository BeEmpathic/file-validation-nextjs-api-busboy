import { useState, useEffect } from "react";
import { DocumentIcon, XCircleIcon } from "@heroicons/react/24/outline";
// TODOS !!!!!!!!!!!! Here comes more todos:
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
  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    if (!isImage && !isVideo) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isImage, isVideo]);

  return (
    <div className="my-5 p-5 rounded-lg bg-sky-500">
      <div className="bg-white p-5 relative aspect-square overflow-hidden rounded-t-lg ">
        {preview && isImage ? (
          <img
            src={preview}
            alt={file.name}
            className="outline-solid inset-0 size-full object-cover aspect-square"
          />
        ) : preview && isVideo ? (
          <video
            src={preview}
            className="outline-solid inset-0 size-full object-cover aspect-square"
            muted
            playsInline
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <DocumentIcon className="text-black" />
        )}
        {/* change this */}
        {/* File Remove button */}
        <button
          className="hover:bg-[rgba(255,0,0,0.5)] w-[3rem] aspect-square flex items-center justify-center absolute top-1 right-1 rounded-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="black"
            class="size-6"
          >
            <path
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
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
