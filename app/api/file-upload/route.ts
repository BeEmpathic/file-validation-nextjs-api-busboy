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
  const MAX_FILE_SIZE = Infinity;
  const MAX_AMOUNT_FILES = 20;
  const MAX_REQUEST_SIZE = Infinity;
  const limits = {
    files: MAX_AMOUNT_FILES,
    fileSize: MAX_FILE_SIZE,
  };
  console.log("The post started let's see here is ther fucking errorr!!!!!");
  try {
    if (
      !(await headerContentLengthCheck(
        req.headers.get("content-length"),
        MAX_REQUEST_SIZE,
      ))
    )
      return Response.json(
        {
          message: "Too big content or broken content",
        },
        {
          headers: { connection: "close" },
          status: 413,
        },
      );

    const result = (await busboyFilesHandler(req, limits)) as {
      pass: boolean;
    };

    if (!result.pass) {
      return Response.json({
        success: false,
        message: "",
        error: "Server Error, not your fault ;-;",
      });
    }

    return Response.json({ success: true, message: "Everything is fine" });
  } catch (error) {
    return Response.json({
      success: false,
      message: "",
      error: "Something unexpected happened, probably server's fault ;-;",
    });
  }
}
