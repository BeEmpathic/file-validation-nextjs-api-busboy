"use server";

import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 } from "uuid";

export async function POST(req: Request) {
  const MAX_FILE_AMOUNT = 25;
  const MAX_FILE_SIZE = 1 * 1024 * 1024;
  let responseMessage = "Initial respone";

  return new Promise<Response>((resolve, reject) => {
    const headers = Object.fromEntries(req.headers);
    const bb = busboy({
      headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        fields: 4,
        files: 1,
        parts: 5,
      },
    });

    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(`File field name: ${name}`);

      const saveTo = path.join(
        process.cwd(),
        "public",
        "uploads",
        "images",
        `${v4()}-${filename}`,
      );

      const writeStream = fs.createWriteStream(saveTo);

      writeStream.on("error", (err) => {
        console.error("Error while saving the file / writeStream error", err);
      });

      file.on("limit", () => {
        console.log("File limit hit!");
        writeStream.end();
        fs.unlink(saveTo, (err) => {
          console.error("error while deleting the file", err);
        });
        nodeStream.unpipe(bb);
        resolve(
          new Response(
            JSON.stringify({
              message: "Too large file",
            }),
            {
              status: 413,
              headers: { Connection: "close" },
            },
          ),
        );
      });

      file.pipe(writeStream);

      return;
    });

    bb.on("close", () => {
      console.log("bb on close!");
      const response = new Response(
        JSON.stringify({ message: responseMessage }),
      );

      resolve(response);
    });

    const nodeStream = Readable.fromWeb(req.body as any);

    let bytesRead = 0;
    nodeStream.on("data", (chunk) => {
      bytesRead += chunk.length;
      console.log(
        `Server read ${(bytesRead / 1024 / 1024).toFixed(2)} MB so far`,
      );
    });

    nodeStream.pipe(bb);
    return;
  });
}
