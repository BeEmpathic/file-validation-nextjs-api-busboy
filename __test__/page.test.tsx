import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { checkFile } from "@/_lib/file-upload/file-upload-frontend";

describe("checkFile() unit Tests", () => {
  it("Should return true for a valid PNG file under the size limit", () => {
    const validFile = new File(["small content"], "avatar.png", {
      type: "image/png",
    });

    const result = checkFile(validFile);

    expect(result).toBe(true);
  });
  it("Should reject files that exceeded the maximum size limit", () => {
    const bigBuffer = new Uint8Array(6 * 1024 * 1024);
    const oversizedFile = new File([bigBuffer], "huge-image.jpg", {
      type: "image/jpeg",
    });

    const result = checkFile(oversizedFile);

    expect(result).not.toBe(true);
    expect(result).toEqual({
      fileName: "huge-image.jpg",
      reason: "Is too large only up to 5242880 MB allowed",
    });
  });
});
