import { NotificationItem, NotificationCategory } from '../types';
import { MOCK_NOTIFICATIONS } from '../mock/notifications';

let notifStore = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  getNotifications: async (category?: NotificationCategory | 'all'): Promise<NotificationItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (category && category !== 'all') {
      return notifStore.filter((n) => n.category === category);
    }
    return [...notifStore];
  },

  markAsRead: async (id: string): Promise<void> => {
    const item = notifStore.find((n) => n.id === id);
    if (item) item.read = true;
  },

  markAllAsRead: async (): Promise<void> => {
    notifStore = notifStore.map((n) => ({ ...n, read: true }));
  },

  sendBroadcast: async (title: string, message: string, category: NotificationCategory): Promise<NotificationItem> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const newNotif: NotificationItem = {
      id: `notif-${Date.now().toString().slice(-4)}`,
      title,
      message,
      category,
      createdAt: 'Just now',
      read: false,
    };
    notifStore = [newNotif, ...notifStore];
    return newNotif;
  },
};
