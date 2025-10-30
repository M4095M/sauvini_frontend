"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Bell, Menu, ChevronDown } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { useLanguage } from "@/hooks/useLanguage"
import ContentHeader from "@/components/modules/ContentHeader"
import NotificationCard from "@/components/notifs/NotificationCard"
import Button from "@/components/ui/button"
import type { Notification } from "@/types/modules"

interface NotificationsGridProps {
  notifications: Notification[]
  isMobile?: boolean
  userLevel?: number
}

export default function NotificationsGrid({ notifications, isMobile = false, userLevel = 6 }: NotificationsGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()

  const [sortBy, setSortBy] = useState<string>("importance")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")
  const [notificationsList, setNotificationsList] = useState(notifications)

  const content = {
    title: t("notifications.title") || "Notifications",
    description: t("notifications.description") || "Stay updated with your learning progress and important announcements.",
  }

  // Filter and sort notifications
  const filteredAndSorted = notificationsList
    .filter((notif) => {
      if (importanceFilter === "all") return true
      if (importanceFilter === "important") return notif.importance === "important" || notif.importance === "most-important"
      if (importanceFilter === "most-important") return notif.importance === "most-important"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "importance") {
        const importanceOrder = { "most-important": 3, "important": 2, "normal": 1 }
        return importanceOrder[b.importance] - importanceOrder[a.importance]
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const markAllAsSeen = () => {
    const updated = notificationsList.map(notif => ({ ...notif, isRead: true }))
    setNotificationsList(updated)
  }

  const markAsSeen = (id: string) => {
    const updated = notificationsList.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    )
    setNotificationsList(updated)
  }

  const deleteNotification = (id: string) => {
    const updated = notificationsList.filter(notif => notif.id !== id)
    setNotificationsList(updated)
  }

  if (isMobile) {
    return (
      <div
        className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
        style={{ padding: "24px 0px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile Top Bar */}
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("modules.level")} {userLevel}
              </span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full" aria-label="Notifications">
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full" onClick={toggle} aria-label="Open menu">
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className={`w-full px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {content.title}
          </h2>
        </div>

        {/* Filters and Mark All */}
        <div className="flex flex-col w-full px-4 gap-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <select
                dir={isRTL ? "rtl" : "ltr"}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${
                  isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"
                }`}
              >
                <option value="importance">{t("notifications.sortByImportance") || "Sort by: Importance"}</option>
                <option value="time">{t("notifications.sortByTime") || "Order by time"}</option>
              </select>
              <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
            </div>

            <div className="relative">
              <select
                dir={isRTL ? "rtl" : "ltr"}
                value={importanceFilter}
                onChange={(e) => setImportanceFilter(e.target.value)}
                className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${
                  isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"
                }`}
              >
                <option value="all">{t("notifications.importanceAll") || "Importance: All"}</option>
                <option value="important">{t("notifications.importanceImportant") || "Important"}</option>
                <option value="most-important">{t("notifications.importanceUrgent") || "Urgent"}</option>
              </select>
              <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
            </div>
          </div>

          <div className={`${isRTL ? "text-left" : "text-right"}`}>
            <Button state="text" size="M" icon_position="none" text={t("notifications.markAllAsSeen") || "Mark all as seen"} onClick={markAllAsSeen} />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex flex-col w-full px-4 gap-6 mt-4">
          <div className="w-full flex flex-col gap-3">
            {filteredAndSorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("notifications.noNotifications") || "No notifications found"}
                </p>
              </div>
            ) : (
              filteredAndSorted.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsSeen={markAsSeen}
                  onDelete={deleteNotification}
                  isMobile={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div className="w-full" style={{ direction: isRTL ? "rtl" : "ltr" }}>

      <div
        className="bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{ display: "flex", padding: "24px", flexDirection: "column", alignItems: "flex-start", gap: 12, alignSelf: "stretch", borderRadius: 52 }}
      >
        {/* Title */}
        <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("notifications.title") || "Notifications"}
          </h2>
        </div>

        {/* Filters Frame */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24, alignSelf: "stretch" }}>
          {/* Filters and Mark All Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch" }}>
            <div className={`flex items-center gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div style={{ display: "flex", width: 276, flexDirection: "column", alignItems: "flex-start" }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="importance">{t("notifications.sortByImportance") || "Sort by: Importance"}</option>
                  <option value="time">{t("notifications.sortByTime") || "Order by time"}</option>
                </select>
              </div>

              <div style={{ display: "flex", width: 276, flexDirection: "column", alignItems: "flex-start" }}>
                <select
                  value={importanceFilter}
                  onChange={(e) => setImportanceFilter(e.target.value)}
                  className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="all">{t("notifications.importanceAll") || "Importance: All"}</option>
                  <option value="important">{t("notifications.importanceImportant") || "Important"}</option>
                  <option value="most-important">{t("notifications.importanceUrgent") || "Urgent"}</option>
                </select>
              </div>
            </div>

            <div>
              <Button state="text" size="M" icon_position="none" text={t("notifications.markAllAsSeen") || "Mark all as seen"} onClick={markAllAsSeen} />
            </div>
          </div>

          {/* Notifications Container */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, alignSelf: "stretch" }}>
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-16 w-full">
                <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>{t("notifications.noNotifications") || "No notifications found"}</p>
              </div>
            ) : (
              filteredAndSorted.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsSeen={markAsSeen}
                  onDelete={deleteNotification}
                  isMobile={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}