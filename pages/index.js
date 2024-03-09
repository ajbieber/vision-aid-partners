import { Inter } from "@next/font/google";
// import {
//   useSession,
//   getSession,
// } from "next-auth/react";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
// import { readUser } from "./api/user";
import  LandingPage from "./landingpage.js";
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0'
import { jwtDecode } from 'jwt-decode';

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  const { user } = useUser();  
  return (
    <Layout>
      <Navigation user={user} />
      {user && (
        <strong>Please ask an admin to add you as user!</strong>
      )}
      < LandingPage user={user}></ LandingPage>
    </Layout>
  );
}


export async function getServerSideProps(ctx) {
  const { user, idToken } = await getSession(ctx.req, ctx.res);
  const idTokenDecoded = jwtDecode(idToken);
  user.isAdmin = idTokenDecoded['https://visionaid.org/roles'].includes('Admin');
  return user;
}
