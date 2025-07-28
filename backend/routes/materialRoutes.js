import express from "express";
import {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
} from "../controllers/materialController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/materials"); // Save files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Protected Routes (require authentication)
router.post(
  "/materials",
  protect,
  upload.single("file"), // Middleware for handling file uploads
  uploadMaterial
);

router.get("/materials/:groupId", protect, getMaterials);

router.delete("/materials/:materialId", protect, deleteMaterial);

export default router;
