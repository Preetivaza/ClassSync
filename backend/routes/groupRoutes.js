// routes/groupRoutes.js
import express from "express";
import {
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  getUserGroups,  
  getGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup, // This is the correct function name
  getGroupByCode,
  joinGroupByCode,
  searchPublicGroups,
  checkIsMember,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/code/:code", getGroupByCode);
router.get("/search", searchPublicGroups);

// Protected Routes (require authentication)
router.post("/", protect, createGroup);
router.get("/:id", protect, getGroupById);
router.put("/:id", protect, updateGroup);
router.delete("/:id", protect, deleteGroup);
router.get("/", protect, getUserGroups);
router.get("/:id/members", protect, getGroupMembers);
router.post("/:id/members", protect, addMemberToGroup);


router.delete("/:id/members/:userId", protect, removeMemberFromGroup);

router.post("/:id/join", protect, joinGroupByCode);
router.get("/:id/is-member", protect, checkIsMember);

export default router;