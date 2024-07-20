'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

type sessionProps = {
  children: React.ReactNode;
  session: Session;
};

function NextAuthSessionProvider({ children, session }: sessionProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default NextAuthSessionProvider;
