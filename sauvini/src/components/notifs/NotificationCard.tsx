"use client"

import { X, AlertCircle, Info, Bell, CreditCard, BookOpen, Trophy, Users } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import type { Notification } from "@/types/modules"

interface NotificationCardProps {
  notification: Notification
  onMarkAsSeen: (id: string) => void
  onDelete: (id: string) => void
  isMobile?: boolean
}

const getNotificationIcon = (type: Notification["type"], importance: Notification["importance"]) => {
  const iconClass = "w-6 h-6"
  
  switch (type) {
    case "payment":
      return <CreditCard className={`${iconClass} text-error-400`} />
    case "unlock":
      return <BookOpen className={`${iconClass} text-primary-400`} />
    case "quiz":
      return <AlertCircle className={`${iconClass} text-warning-400`} />
    case "content":
      return <Info className={`${iconClass} text-primary-400`} />
    case "exercise":
      return <Trophy className={`${iconClass} text-success-400`} />
    case "general":
    default:
      return <Bell className={`${iconClass} text-primary-400`} />
  }
}

const getImportanceStyle = (importance: Notification["importance"]) => {
  switch (importance) {
    case "most-important":
      return "bg-error-100 text-error-400"
    case "important":
      return "bg-warning-100 text-warning-400"
    case "normal":
    default:
      return "bg-primary-100 text-primary-400"
  }
}

const getImportanceText = (importance: Notification["importance"], t: any) => {
  switch (importance) {
    case "most-important":
      return t("notifications.urgent") || "Urgent"
    case "important":
      return t("notifications.important") || "Important"
    case "normal":
    default:
      return t("notifications.normal") || "Normal"
  }
}

const getIconBackground = (type: Notification["type"]) => {
  switch (type) {
    case "payment":
      return "bg-error-100"
    case "unlock":
      return "bg-primary-100"
    case "quiz":
      return "bg-warning-100"
    case "content":
      return "bg-primary-100"
    case "exercise":
      return "bg-success-100"
    case "general":
    default:
      return "bg-primary-100"
  }
}

export default function NotificationCard({ notification, onMarkAsSeen, onDelete, isMobile = false }: NotificationCardProps) {
  const { t, isRTL } = useLanguage()

  return (
    <div
      className={`relative ${notification.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
      style={{
        display: "flex",
        padding: "40px 20px 24px 20px",
        alignItems: "flex-start",
        gap: 16,
        alignSelf: "stretch",
        borderRadius: 16,
        direction: isRTL ? "rtl" : "ltr",
        opacity: notification.isRead ? 0.7 : 1
      }}
    >
      {/* Icon */}
      <div
        className={getIconBackground(notification.type)}
        style={{
          display: "flex",
          padding: 8,
          alignItems: "center",
          gap: 10,
          borderRadius: 22,
        }}
      >
        {getNotificationIcon(notification.type, notification.importance)}
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          flex: "1 0 0",
        }}
      >
        {/* Title */}
        <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'} ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {notification.title}
        </h3>
        
        {/* Importance Badge */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-xl ${getImportanceStyle(notification.importance)}`}
          style={{
            display: "flex",
            padding: "4px 8px",
            alignItems: "center",
            gap: 4,
            borderRadius: 12,
          }}
        >
          {getImportanceText(notification.importance, t)}
        </span>

        {/* Description */}
        <p className={`text-sm ${notification.isRead ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'} leading-relaxed ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {notification.content}
        </p>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "absolute",
          right: isRTL ? "auto" : 16,
          left: isRTL ? 16 : "auto",
          top: 16,
        }}
      >
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsSeen(notification.id)}
            className={`text-xs text-primary-300 hover:text-primary-400 font-bold ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {t("notifications.markAsSeen") || "Mark as seen"}
          </button>
        )}
        
        <button
          onClick={() => onDelete(notification.id)}
          className="text-gray-400 hover:text-error-400 transition-colors"
          aria-label="Delete notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}