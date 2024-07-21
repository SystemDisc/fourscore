'use client';

import { User } from '@/db/database';
import Cookies from 'js-cookie';
import { Simplify } from 'kysely';
import moment from 'moment';
import { useEffect } from 'react';

export default function GAConversion({ user }: { user: Simplify<User> }) {
  useEffect(() => {
    const gclid = Cookies.get('gclid');
    window.dataLayer?.push({
      event: 'sign_up',
      engagement_time_msec: 100,
      method: user.name ? 'Google' : 'Email',
      value: 1,
      currency: 'USD',
      user_email: user.email,
      campaign: gclid ? '(paid)' : '(organic)',
      gclid,
      dateCreated: moment().toISOString(),
    } as GASignupEvent);
  }, []);

  return null;
}
