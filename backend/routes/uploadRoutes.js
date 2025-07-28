import express from "express";
import { upload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

// Single file upload
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to upload file" });
  }
});

export default router;
