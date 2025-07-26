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
// import { authMiddleware } from "../middleware/authMiddleware.js";

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


import express from "express";
import { createGroup } from "../controllers/groupController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Routes (require authentication)
router.post("/groups", authMiddleware, createGroup);

export default router;