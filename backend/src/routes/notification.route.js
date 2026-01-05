import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:notificationId/read", protectRoute, markAsRead);
router.put("/mark-all-read", protectRoute, markAllAsRead);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
