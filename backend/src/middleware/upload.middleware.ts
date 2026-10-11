import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { SALARY_SLIP_UPLOAD } from "../config/upload.config";
import { ValidationError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

const FIELD = SALARY_SLIP_UPLOAD.FIELD_NAME;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: SALARY_SLIP_UPLOAD.MAX_SIZE_BYTES, files: 1 },
  // Accepts only PDF, JPG and PNG files by both mime type and extension
  fileFilter: (_req, file, cb) => {
    const extOk = (SALARY_SLIP_UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = (SALARY_SLIP_UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, { [FIELD]: MESSAGES.APPLICATION.SLIP_INVALID_TYPE }));
  },
});

// Receives the salary slip file in memory and converts upload failures into standard validation errors
export const uploadSalarySlip = (req: Request, res: Response, next: NextFunction) => {
  upload.single(FIELD)(req, res, (err: unknown) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? MESSAGES.APPLICATION.SLIP_TOO_LARGE
          : err.code === "LIMIT_UNEXPECTED_FILE"
            ? `Send the file in the "${FIELD}" field`
            : err.message;
      return next(new ValidationError(MESSAGES.COMMON.VALIDATION_FAILED, { [FIELD]: message }));
    }
    next(err);
  });
};
