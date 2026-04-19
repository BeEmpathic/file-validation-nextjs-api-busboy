import { returnedInfoType } from "@/_types/fileUploadTypes";

type DisplayResultProps = {
  result: returnedInfoType;
};

export default function DiplayResult({ result }: DisplayResultProps) {
  return (
    <div id="result">
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
            <div key={index}>{fileName} Uploaded successfully</div>
          ))
        : null}
      {}
    </div>
  );
}
