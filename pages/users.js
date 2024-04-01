import Navigation from "./navigation/Navigation";
import Layout from './components/layout';
import SidePanel from "./components/SidePanel";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { allUsers, getUserFromSession } from "@/pages/api/user";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    if (user === null) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (
      !user.admin &&
      (user.hospitalRole.length == 0 || user.hospitalRole[0].admin != true)
    ) {
      console.log("user admin is null or is not a manager of hospital");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        user: user,
        // hospitals: await findAllHospital(),
        users: await allUsers(),
        // roles: await allHospitalRoles(),
        error: null,
      },
    };
  }
});

export default function Users(props) {
  
  const handleSelect = () => {};

  return (
    <Layout>
      <div className="content">
        <Navigation user={props.user} />
        <SidePanel options={['Users', 'Roles', 'Hospitals']}  defaultOption="Users" handleSelection={handleSelect} />
      </div>
    </Layout>
  );
}
