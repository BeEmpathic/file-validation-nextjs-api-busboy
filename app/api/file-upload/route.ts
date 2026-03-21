"use server";

import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 } from "uuid";

export async function POST(req: Request) {
  const MAX_FILE_AMOUNT = 25;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_TOTAL_UPLOAD = 1 * 1 * 1024 * 1024;
  let responseMessage = "Everything done correctly / no error fired";
  const MAX_TOTAL = 1 * 1024 * 1024;

  const contentLength = req.headers.get("content-length");

  if (!contentLength) {
    // Missing → could be chunked / streaming client → decide policy
    return Response.json(
      { message: "Content-Length required for this endpoint" },
      { status: 411 }, // Length Required – or 400
    );
  }

  const bytes = Number(contentLength);
  if (Number.isNaN(bytes) || bytes <= 0) {
    return Response.json(
      { message: "Invalid Content-Length" },
      { status: 400 },
    );
  }

  if (bytes > MAX_TOTAL) {
    console.log("Too large content length if was true");
    return Response.json(
      {
        message: "Total request too large",
        maxBytes: MAX_TOTAL,
        received: bytes,
      },
      { status: 413 },
    );
  }

  return new Promise<Response>((resolve, reject) => {
    const headers = Object.fromEntries(req.headers);
    const bb = busboy({
      headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        fields: 1,
        files: 3,
        parts: 5,
      },
    });
    bb.on("fileslimit", () => {
      nodeStream.unpipe(bb);
      reject("Too many files");
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
        console.log("File size limit hit!");

        // the logic when the limit is hit
        writeStream.end();
        fs.unlink(saveTo, (err) => {
          if (err) console.error("error while deleting the file", err);
        });
        nodeStream.unpipe(bb);

        // resolving the promise
        reject("Too large file");
      });

      file.pipe(writeStream);

      return;
    });

    bb.on("error", (err) => {
      nodeStream.unpipe(bb);
      resolve(
        new Response(JSON.stringify({ error: "Invalid multipart data" }), {
          status: 400,
          headers: { Connection: "close" },
        }),
      );
    });

    bb.on("close", () => {
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
