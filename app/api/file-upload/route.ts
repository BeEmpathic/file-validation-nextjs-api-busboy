"use server";

import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 } from "uuid";

export async function POST(req: Request) {
  // the values so I don't have to look for them in code
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "images");
  const MAX_FILE_AMOUNT = 25;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // check if the content isn't too big I should set it to the file size summed I guess not the size of one file, but I leave it like this for testing
  // reading headers suppose to not be bad I will check that
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE * 1.1) {
    return new Response(JSON.stringify({ message: "File size too big" }), {
      status: 413,
    });
  }
  // remember to make the folder with commends later lazy bastard
  //  fs.mkdir(UPLOAD_DIR, { recursive: true })

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const headers = Object.fromEntries(req.headers);

  const bb = busboy({
    headers: headers,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: MAX_FILE_AMOUNT,
    },
  });
  bb.on("file", (name, file, info) => {
    console.log(name);
    console.log(info);
    console.log(file);
  });
  bb.on("close", () => {
    return new Response(
      JSON.stringify({
        message: "SUccess, but you didn't do the file save yet",
      }),
    );
  });

  const nodeStream = Readable.fromWeb(req.body as any);

  nodeStream.on("error", () => nodeStream.destroy());

  nodeStream.pipe(bb);

  return;
}
