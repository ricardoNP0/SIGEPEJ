import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve("uploads/evidences");

// Crear carpeta automáticamente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "_");

    cb(null, uniqueName);
  },
});

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Solo se permiten PDF, JPG y PNG"
      )
    );
  }
};

export const uploadEvidence = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});