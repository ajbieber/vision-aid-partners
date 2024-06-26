import '../styles/globals.css'
import '../styles/vaPartner.css'
import 'bootstrap/dist/css/bootstrap.css'
// import {SessionProvider} from "next-auth/react"
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google'
import { useEffect } from "react";
import '../styles/LandingPage.css'
import Head from 'next/head';


// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  return (
    <>
      <Head>
        <title>https://vision-aid-partners-spring-2024.vercel.app/</title>
        <meta name="description" content="vision-aid partners" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5E20" />
      </Head>
      <UserProvider>
        <main className={`${inter.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </UserProvider>
    </>
  );
}
