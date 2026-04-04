"use server";

import { NextRequest } from "next/server";

import {
  busboyFilesHandler,
  headerContentLengthCheck,
} from "@/_lib/file-upload/file-upload-backend";

export async function POST(req: NextRequest) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_AMOUNT_FILES = 20;
  const MAX_REQUEST_SIZE = 5 * 15 * 1024 * 1024;
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

    type returnedInfoType = {
      pass: boolean;
      message: string;
      status: number;
      uploadedFilesNames: string[];
      error: string;
    };

    const result = (await busboyFilesHandler(req, limits)) as returnedInfoType;

    if (!result.pass) {
      return Response.json(result);
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({
      success: false,
      message: "",
      error: "Something unexpected happened, probably server's fault ;-;",
    });
  }
}
