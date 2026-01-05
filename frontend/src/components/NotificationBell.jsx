import { useNotificationStore } from "../store/useNotificationStore";
import { useEffect } from "react";
import { Bell, Trash2 } from "lucide-react";

export const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, deleteNotification, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle indicator">
        <span className="indicator-item badge badge-primary">{unreadCount}</span>
        <Bell size={20} />
      </button>
      <div className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No notifications</p>
        ) : (
          <>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-start ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  className="btn btn-xs btn-ghost"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
