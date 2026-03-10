import { NextRequest, NextResponse } from "next/server";
import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return NextResponse.json({});
  }

  const bb = busboy({ headers: Object.fromEntries(req.headers) });

  const savedFiles: string[] = [];
  const validationErrors: string[] = [];
  const fileSavePromises: Promise<void>[] = [];

  bb.on("files", (fieldname, file, info) => {
    const { filename, mimeType } = info;
  });
}
