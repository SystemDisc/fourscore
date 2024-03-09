'use client';

import NotificationPanel from '@/components/molecules/notification-panel';
import { Notification } from '@/types';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';

export const notificationContext = createContext<{
  addNotification: (notification: Notification) => Promise<void>;
}>({
  addNotification: async () => {},
});

function NotificationProvider({ children }: PropsWithChildren<{}>) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = async (notification: Notification) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      if (!notification.uuid) {
        notification.uuid = v4();
      }
      newNotifications.push(notification);
      return newNotifications;
    });
  };

  const onDone = (uuid: string) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      const index = newNotifications.findIndex((notification) => notification.uuid === uuid);

      if (index >= 0) {
        newNotifications.splice(index, 1);
        return newNotifications;
      } else {
        return prevNotifications;
      }
    });
  }

  return (
    <notificationContext.Provider value={{addNotification}}>
      {children}
      <NotificationPanel notifications={notifications} onDone={onDone} />
    </notificationContext.Provider>
  );
}

export default NotificationProvider;
