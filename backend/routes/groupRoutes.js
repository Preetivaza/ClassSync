<<<<<<< HEAD
// import express from "express";
// import {
//   createGroup,
//   getGroupById,
//   updateGroup,
//   deleteGroup,
//   getUserGroups,  
//   getGroupMembers,
//   addMemberToGroup,
//   removeMemberFromGroup,
//   getGroupByCode,
//   joinGroupByCode,
//   searchPublicGroups,
//   checkIsMember,
// } from "../controllers/groupController.js";
// import authMiddleware from "../middleware/authMiddleware.js"; // Default import

// const router = express.Router();

// // Public Routes
// router.get("/groups/code/:code", getGroupByCode);
// router.post("/groups/search", searchPublicGroups);

// // Protected Routes (require authentication)
// router.post("/groups", authMiddleware, createGroup);

// router.get("/groups/:id", authMiddleware, getGroupById);
// router.put("/groups/:id", authMiddleware, updateGroup);
// router.delete("/groups/:id", authMiddleware, deleteGroup);
// router.get("/groups", authMiddleware, getUserGroups);
// router.get("/groups/:id/members", authMiddleware, getGroupMembers);
// router.post("/groups/:id/members", authMiddleware, addMemberToGroup);
// router.delete(
//   "/groups/:id/members/:userId",
//   authMiddleware,
//   removeMemberFromGroup
// );
// router.post("/groups/:id/join", authMiddleware, joinGroupByCode);
// router.get("/groups/:id/is-member", authMiddleware, checkIsMember);

// export default router;


// // import express from "express";
// // import { createGroup } from "../controllers/groupController.js";
// // import { authMiddleware } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // // Protected Routes (require authentication)
// // router.post("/groups", authMiddleware, createGroup);

// // export default router;

=======
>>>>>>> 622a63b06775f8498894f46684bbc9b82cb8a236
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
<<<<<<< HEAD
router.post("/groups", protect, createGroup);
=======
>>>>>>> 622a63b06775f8498894f46684bbc9b82cb8a236

// Protected Routes (require authentication)
router.post("/", protect, createGroup);
router.get("/:id", protect, getGroupById);
router.put("/:id", protect, updateGroup);
router.delete("/:id", protect, deleteGroup);
router.get("/", protect, getUserGroups);
<<<<<<< HEAD
router.get("/users", protect, getUserGroups);

router.get("/:id/members", protect, getGroupMembers);
router.post("/:id/members", protect, addMemberToGroup);

// FIXED: Typo corrected - removeMemberToGroup -> removeMemberFromGroup
=======
router.get("/:id/members", protect, getGroupMembers);
router.post("/:id/members", protect, addMemberToGroup);


>>>>>>> 622a63b06775f8498894f46684bbc9b82cb8a236
router.delete("/:id/members/:userId", protect, removeMemberFromGroup);

router.post("/:id/join", protect, joinGroupByCode);
router.get("/:id/is-member", protect, checkIsMember);

export default router;