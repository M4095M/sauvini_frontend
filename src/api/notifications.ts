import { BaseApi } from "./base";

// ============================================
// Types
// ============================================

export interface Notification {
  id: string;
  title: string;
  content: string;
  importance: NotificationImportance;
  notification_type: NotificationType;
  user_id: string;
  user_type: UserType;
  is_read: boolean;
  icon?: string;
  action_url?: string;
  created_at?: string;
}

export enum NotificationImportance {
  Normal = "normal",
  Important = "important",
  MostImportant = "most-important",
}

export enum NotificationType {
  Payment = "payment",
  Unlock = "unlock",
  Quiz = "quiz",
  Content = "content",
  Exercise = "exercise",
  General = "general",
}

export enum UserType {
  Student = "student",
  Professor = "professor",
  Admin = "admin",
}

// Request DTOs
export interface CreateNotificationRequest {
  title: string;
  content: string;
  importance: NotificationImportance;
  notification_type: NotificationType;
  user_id: string;
  user_type: UserType;
  icon?: string;
  action_url?: string;
}

export interface NotificationQueryParams {
  page?: number;
  per_page?: number;
}

// Response DTOs
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  per_page: number;
  unread_count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  updated_count: number;
}

// ============================================
// API Client
// ============================================

class NotificationsApi extends BaseApi {
  private baseUrl = "/api/v1/notifications";

  // Notification management
  async getNotifications(
    params: NotificationQueryParams = {}
  ): Promise<ApiResponse<NotificationListResponse>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return this.get<NotificationListResponse>(url);
  }

  async getNotificationById(
    notificationId: string
  ): Promise<ApiResponse<Notification>> {
    return this.get<Notification>(`${this.baseUrl}/${notificationId}`);
  }

  async createNotification(
    request: CreateNotificationRequest
  ): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(this.baseUrl, request);
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<ApiResponse<Notification>> {
    return this.put<Notification>(`${this.baseUrl}/${notificationId}/read`, {});
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<MarkAsReadResponse>> {
    return this.put<MarkAsReadResponse>(`${this.baseUrl}/read-all`, {});
  }

  async deleteNotification(
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>(
      `${this.baseUrl}/${notificationId}`
    );
  }

  async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    return this.get<{ unread_count: number }>(`${this.baseUrl}/unread-count`);
  }

  async getNotificationsByType(
    notificationType: NotificationType,
    params: NotificationQueryParams = {}
  ): Promise<ApiResponse<Notification[]>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/by-type/${notificationType}?${queryString}`
      : `${this.baseUrl}/by-type/${notificationType}`;

    return this.get<Notification[]>(url);
  }

  async getNotificationsByImportance(
    importance: NotificationImportance,
    params: NotificationQueryParams = {}
  ): Promise<ApiResponse<Notification[]>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/by-importance/${importance}?${queryString}`
      : `${this.baseUrl}/by-importance/${importance}`;

    return this.get<Notification[]>(url);
  }

  // Helper methods
  transformNotification(notification: Notification): Notification {
    return {
      ...notification,
      id: notification.id.replace("Notification:", ""),
    };
  }

  transformNotificationListResponse(
    response: NotificationListResponse
  ): NotificationListResponse {
    return {
      ...response,
      notifications: response.notifications.map((n) =>
        this.transformNotification(n)
      ),
    };
  }

  // Utility methods for creating specific notification types
  createQuizNotification(
    userId: string,
    userType: UserType,
    quizTitle: string,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: `New Quiz Available: ${quizTitle}`,
      content: `A new quiz '${quizTitle}' has been added to your course.`,
      importance: NotificationImportance.Normal,
      notification_type: NotificationType.Quiz,
      user_id: userId,
      user_type: userType,
      icon: "quiz",
      action_url: actionUrl,
    };
  }

  createExamNotification(
    userId: string,
    userType: UserType,
    examTitle: string,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: `New Exam Available: ${examTitle}`,
      content: `A new exam '${examTitle}' has been scheduled for your course.`,
      importance: NotificationImportance.Important,
      notification_type: NotificationType.Content,
      user_id: userId,
      user_type: userType,
      icon: "exam",
      action_url: actionUrl,
    };
  }

  createExerciseNotification(
    userId: string,
    userType: UserType,
    exerciseTitle: string,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: `New Exercise Available: ${exerciseTitle}`,
      content: `A new exercise '${exerciseTitle}' has been added to your course.`,
      importance: NotificationImportance.Normal,
      notification_type: NotificationType.Exercise,
      user_id: userId,
      user_type: userType,
      icon: "exercise",
      action_url: actionUrl,
    };
  }

  createQuestionNotification(
    userId: string,
    userType: UserType,
    questionTitle: string,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: `New Question Asked: ${questionTitle}`,
      content: `A student has asked a new question: '${questionTitle}'`,
      importance: NotificationImportance.Normal,
      notification_type: NotificationType.General,
      user_id: userId,
      user_type: userType,
      icon: "question",
      action_url: actionUrl,
    };
  }

  createPaymentNotification(
    userId: string,
    userType: UserType,
    amount: number,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: "Payment Required",
      content: `A payment of $${amount.toFixed(
        2
      )} is required to continue accessing premium content.`,
      importance: NotificationImportance.MostImportant,
      notification_type: NotificationType.Payment,
      user_id: userId,
      user_type: userType,
      icon: "payment",
      action_url: actionUrl,
    };
  }

  createUnlockNotification(
    userId: string,
    userType: UserType,
    contentName: string,
    actionUrl?: string
  ): CreateNotificationRequest {
    return {
      title: "Content Unlocked",
      content: `You have successfully unlocked: ${contentName}`,
      importance: NotificationImportance.Normal,
      notification_type: NotificationType.Unlock,
      user_id: userId,
      user_type: userType,
      icon: "unlock",
      action_url: actionUrl,
    };
  }
}

export const notificationsApi = new NotificationsApi();
