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

    let limitReached = false;

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
        resolve(
          new Response(
            JSON.stringify({
              message: "Too large file",
            }),
          ),
        );
      });

      file.pipe(writeStream);

      return;
    });

    bb.on("close", () => {
      if (limitReached) {
        responseMessage = "Too large file";
      }

      const response = new Response(
        JSON.stringify({ message: responseMessage }),
      );

      resolve(response);
    });

    const nodeStream = Readable.fromWeb(req.body as any);
    nodeStream.pipe(bb);
    return;
  });
}
