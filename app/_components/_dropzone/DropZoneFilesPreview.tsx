import { useState, useEffect } from "react";
import {
  DocumentIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
// TODOS !!!!!!!!!!!! Here comes more todos:

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
          className="transition-all duration-300 ease-in-out [filter:drop-shadow(0_0_1px_black)_drop-shadow(0_0_1px_black)] hover:[filter:none] hover:bg-[rgba(255,0,0,0.4)] w-[3rem] aspect-square flex items-center justify-center absolute top-1 right-1 rounded-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          <XCircleIcon />
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
