import { randomUUID } from "crypto";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { SALARY_SLIP_UPLOAD } from "../config/upload.config";
import { InternalServerError, StorageError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

export interface StoredFile {
  publicId: string;
  url: string;
  resourceType: string;
}

// Throws if Cloudinary credentials are missing from the environment
const assertConfigured = (): void => {
  if (!isCloudinaryConfigured) throw new InternalServerError(MESSAGES.APPLICATION.STORAGE_NOT_CONFIGURED);
};

// Uploads a salary slip buffer to Cloudinary as a private (authenticated) asset
export const uploadSalarySlipFile = async (buffer: Buffer): Promise<StoredFile> => {
  assertConfigured();
  try {
    return await new Promise<StoredFile>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: SALARY_SLIP_UPLOAD.CLOUDINARY_FOLDER,
          public_id: randomUUID(),
          resource_type: "auto",
          type: "authenticated",
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Empty Cloudinary response"));
          resolve({ publicId: result.public_id, url: result.secure_url, resourceType: result.resource_type });
        }
      );
      stream.end(buffer);
    });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw new StorageError(MESSAGES.APPLICATION.STORAGE_UPLOAD_FAILED);
  }
};

// Deletes a stored salary slip from Cloudinary and ignores failures (best-effort cleanup)
export const deleteSalarySlipFile = async (publicId: string, resourceType: string): Promise<void> => {
  if (!isCloudinaryConfigured) return;
  await cloudinary.uploader
    .destroy(publicId, { resource_type: resourceType, type: "authenticated" })
    .catch((err) => console.error("Cloudinary delete failed:", err));
};
