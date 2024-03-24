import { Inter } from "@next/font/google";
import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import  LandingPage from "./landingpage.js";
import { useUser } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  
  let formattedUser = null;
  if (user) {
    // Format user for naviagtion
    const userMetadata = user['https://vapartners.org/app_metadata'];
    formattedUser = {
      email: user.email,
      name: user.name,
      admin: (userMetadata.va_partners.admin !== undefined) ? userMetadata.va_partners.admin : false,
      hospitalRole: userMetadata.va_partners.hospitalRole
    };
  }

  return (
    <Layout>
      <Navigation user={formattedUser} />
      {!formattedUser || (!formattedUser.admin && formattedUser.hospitalRole.length == 0) && (
        <strong>Please ask an admin to add you as user!</strong>
      )}
      <LandingPage user={formattedUser}></ LandingPage>
    </Layout>
  );
}
