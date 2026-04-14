"use server";

import { returnedInfoType } from "@/_types/fileUploadTypes";

import { NextRequest } from "next/server";

import {
  busboyFilesHandler,
  headerContentLengthCheck,
} from "@/_lib/file-upload/file-upload-backend";

export async function POST(req: NextRequest) {
  const FILES_MAX_AMOUNT: number = process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT
    ? parseInt(process.env.NEXT_PUBLIC_FILES_MAX_AMOUNT)
    : 20;
  const FILE_MAX_SIZE = process.env.NEXT_PUBLIC_FILE_MAX_SIZE
    ? parseInt(process.env.NEXT_PUBLIC_FILE_MAX_SIZE) * 1024 * 1024
    : 5 * 1024 * 1024;
  const REQUEST_MAX_SIZE = FILES_MAX_AMOUNT * FILE_MAX_SIZE;

  // you don't check if files type is media only or not in backend it will become a problem

  // busboy limits
  const limits = {
    files: FILES_MAX_AMOUNT,
    fileSize: FILE_MAX_SIZE,
  };

  try {
    if (
      !(await headerContentLengthCheck(
        req.headers.get("content-length"),
        REQUEST_MAX_SIZE,
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
