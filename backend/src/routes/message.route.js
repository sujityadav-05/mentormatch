import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  getMessages, 
  getUsersForSidebar, 
  sendMessage,
  markMessageAsRead,
  searchMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getUsersForSidebar); // Renamed for clarity
router.get("/messages/:receiverId", protectRoute, getMessages); // Changed `id` to `receiverId`
router.post("/messages/:receiverId", protectRoute, sendMessage); // Updated route for consistency
router.put("/messages/:messageId/read", protectRoute, markMessageAsRead); // Mark as read
router.get("/search/:receiverId", protectRoute, searchMessages); // Search messages

export default router;