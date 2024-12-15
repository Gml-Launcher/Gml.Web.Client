import { create } from 'zustand';

import { NotificationBaseEntity } from '@/shared/api/contracts';

interface Notifications {
  count: number;
  setCount: (i: number) => void;
  addCount: () => void;
  clearCount: () => void;

  notifications: Array<NotificationBaseEntity>;
  setNotifications: (notifys: NotificationBaseEntity[]) => void;
  addNotification: (notify: NotificationBaseEntity) => void;
  clearNotifications: () => void;
}

export const useNotificationsState = create<Notifications>()((set) => ({
  count: 0,
  setCount: (i: number) => {
    set((state) => ({ count: state.count + i }));
  },
  addCount: () => {
    set((state) => ({ count: state.count + 1 }));
  },
  clearCount: () => {
    set(() => ({ count: 0 }));
  },

  notifications: [],
  setNotifications: (notifys: NotificationBaseEntity[]) => {
    set(() => ({ notifications: notifys }));
  },
  addNotification: (notify: NotificationBaseEntity) => {
    set((state) => ({ notifications: state.notifications.concat(notify) }));
  },
  clearNotifications: () => {
    set(() => ({ notifications: [] }));
  },
}));
