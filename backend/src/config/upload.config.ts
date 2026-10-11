export const SALARY_SLIP_UPLOAD = {
  FIELD_NAME: "salarySlip",
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ["application/pdf", "image/jpeg", "image/png"],
  ALLOWED_EXTENSIONS: [".pdf", ".jpg", ".jpeg", ".png"],
  CLOUDINARY_FOLDER: "lms/salary-slips",
} as const;
