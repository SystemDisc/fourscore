'use client';

import { Notification } from '@/types';
import classNames from 'classnames';
import { useEffect } from 'react';
import Alert from '../atoms/alert';

export default function NotificationPanel({
  notifications,
  onDone,
}: {
  notifications: Notification[];
  onDone: (uuid: string) => void;
}) {
  return (
    <section className='grid grid-cols-1 fixed bottom-4 left-4 right-4 gap-4'>
      {notifications.map((notification) => (
        <Alert
          key={notification.uuid}
          notification={notification}
          onDone={onDone}
        />
      ))}
    </section>
  );
}
