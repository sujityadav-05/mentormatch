import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data });
      
      const unreadCount = res.data.filter((n) => !n.isRead).length;
      set({ unreadCount });
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      
      const notifications = get().notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      set({ notifications });
      
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ unreadCount });
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/notifications/mark-all-read");
      
      const notifications = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.log("Error marking all as read:", error);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      
      const notifications = get().notifications.filter((n) => n._id !== notificationId);
      set({ notifications });
      
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ unreadCount });
    } catch (error) {
      console.log("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  },

  addNotification: (notification) => {
    const notifications = [notification, ...get().notifications];
    set({ notifications });
    set({ unreadCount: get().unreadCount + 1 });
  },
}));
