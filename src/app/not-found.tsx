import MainCard from '@/components/atoms/main-card';
import MainNav from '@/components/molecules/main-nav';
import authOptions from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import React from 'react';

const styles: Record<string, React.CSSProperties> = {
  error: {
    // https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css#L38-L52
    fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    display: 'inline-block',
  },

  h1: {
    display: 'inline-block',
    margin: '0 20px 0 0',
    padding: '0 23px 0 0',
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: 'top',
    lineHeight: '49px',
  },

  h2: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '49px',
    margin: 0,
  },
};

export default async function NotFound() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Head>
        <title>404: This page could not be found.</title>
      </Head>
      <MainCard style={styles.error}>
        <MainNav loggedIn={!!session?.user} />
        <div className='flex justify-center items-center content-center p-4 pt-0'>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                body { margin: 0; color: #000; background: #fff; }
                .next-error-h1 {
                  border-right: 1px solid rgba(0, 0, 0, .3);
                }
              `,
            }}
          />
          <h1
            className='next-error-h1'
            style={styles.h1}
          >
            404
          </h1>
          <div style={styles.desc}>
            <h2 style={styles.h2}>This page could not be found.</h2>
          </div>
        </div>
      </MainCard>
    </>
  );
}
