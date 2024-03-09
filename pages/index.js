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
  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  let roles = [];
  if (user) {
    roles = user['https://visionaid.org/roles'];
  }

  return (
    <Layout>
      <Navigation user={user} />
      {user && roles.length == 0 && (
        <strong>Please ask an admin to add you as user!</strong>
      )}
      <LandingPage user={user}></LandingPage>
    </Layout>
  );
}


export async function getServerSideProps(ctx) {
  const session = await getSession(ctx.req, ctx.res);

  // User hasn't logged in yet
  if (!session) {
    return { props: {} }
  }

  const { user, idToken } = session;
  const idTokenDecoded = jwtDecode(idToken);
  user.isAdmin = idTokenDecoded['https://visionaid.org/roles'].includes('Admin');
  user.roles = idTokenDecoded['https://visionaid.org/roles'];
  return { props: { user: user } };
}
