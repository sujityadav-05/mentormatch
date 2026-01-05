import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ userId })
      .populate("fromUserId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });

    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in markAsRead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.log("Error in markAllAsRead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log("Error in deleteNotification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNotification = async (userId, type, fromUserId, message, data = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      fromUserId,
      message,
      data,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.log("Error in createNotification:", error);
  }
};
