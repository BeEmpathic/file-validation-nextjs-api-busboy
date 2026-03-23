"use server";

import { NextRequest } from "next/server";
import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 } from "uuid";
import {
  busboyFilesHandler,
  headerContentLengthCheck,
} from "@/_lib/file-upload/file-upload-backend";

export async function POST(req: NextRequest) {
  const limits = {
    MAX_FILE_AMOUNT: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_TOTAL_UPLOAD: 5 * 20 * 1024 * 1024,
  };

  let responseMessage = "Everything done correctly / no error fired";

  if (!(await headerContentLengthCheck(req.headers.get("content-length"))))
    return Response.json(
      {
        message: "Too big content or broken content",
      },
      {
        headers: { connection: "close" },
        status: 413,
      },
    );

  const filesSaved = await busboyFilesHandler(req);

  if (!filesSaved.pass) {
    return Response.json({
      success: false,
      message: "",
      error: "Server Error, not your fault ;-;",
    });
  }

  return Response.json({ success: true, message: "Everything is fine" });
}
