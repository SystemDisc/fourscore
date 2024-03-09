'use client';

import { Notification } from '@/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';

export default function Alert({
  notification,
  onDone,
}: {
  notification: Notification,
  onDone: (uuid: string) => void,
}) {
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout>();
  useEffect(() => {
    setTimeoutRef(setTimeout(() => {
      onDone(notification.uuid!);
    }, 5000));

    return () => {
      clearTimeout(timeoutRef);
    }
  }, []);

  return (
    <div className={classNames('rounded p-4 w-full max-w-2xl mx-auto', {
      'bg-red-700 text-white': notification.type === 'error',
      'bg-green-700 text-white': notification.type === 'success',
    })}>
      <div className='inline-block whitespace-pre-wrap w-[calc(100%_-_1rem)]'>
        {notification.message}
      </div>
      <div className="w-4 text-right text-2xl inline-flex items-center">
        <button onClick={() => {
          clearTimeout(timeoutRef);
          onDone(notification.uuid!);
        }}>
          <BsXCircle />
        </button>
      </div>
    </div>
  );
}
