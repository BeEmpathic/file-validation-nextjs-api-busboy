import { returnedInfoType } from "@/_types/fileUploadTypes";

type DisplayResultProps = {
  result: returnedInfoType;
};

export default function DisplayResult({ result }: DisplayResultProps) {
  return (
    <div id="result" className="flex-auto border">
      {result.error ? (
        <div className="text-red-500">{result.error}</div>
      ) : (
        result.message
      )}
      {result.rejectedFiles
        ? result.rejectedFiles.map((rejectedFile, index: number) => (
            <div className="text-red-500" key={index}>
              {rejectedFile.fileName} {rejectedFile.reason}
            </div>
          ))
        : null}

      {result.uploadedFilesNames
        ? result.uploadedFilesNames.map((fileName: string, index: number) => (
            <div className="text-green-500" key={index}>
              {" "}
              {fileName} Uploaded successfully!
            </div>
          ))
        : null}
      {}
    </div>
  );
}
