"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import ProfessorNotificationsGrid from "@/components/professor/notifs/ProfessorNotificationsGrid";
import Loader from "@/components/ui/Loader";
import { useProfessorProfile } from "@/hooks/useProfessorProfile";
import {
  notificationsApi,
  type Notification,
  type NotificationListResponse,
} from "@/api/notifications";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
}

export default function ProfessorNotificationsPage() {
  const { language } = useLanguage();
  const { professorProfile, isHydrated } = useProfessorProfile();
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await notificationsApi.getNotifications({
          page: 1,
          per_page: 50,
        });
        if (response.success && response.data) {
          const transformedResponse =
            notificationsApi.transformNotificationListResponse(response.data);
          setNotifications(transformedResponse.notifications);
          setUnreadCount(transformedResponse.unread_count);
        } else {
          setError("Failed to load notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await notificationsApi.markNotificationAsRead(
        notificationId
      );
      if (response.success && response.data) {
        // Update the notification in the local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationsApi.markAllNotificationsAsRead();
      if (response.success && response.data) {
        // Update all notifications to read
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await notificationsApi.deleteNotification(
        notificationId
      );
      if (response.success && response.data?.success) {
        // Remove the notification from the local state
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
        // Decrease unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (!isHydrated) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProfessorNotificationsGrid
      notifications={notifications}
      isMobile={isMobile}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onDeleteNotification={handleDeleteNotification}
      unreadCount={unreadCount}
    />
  );
}
