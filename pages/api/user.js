import prisma from "client";
import { ManagementClient } from "auth0";
import { use } from "react";
import { getSession } from '@auth0/nextjs-auth0';

const managementClient = new ManagementClient({
  domain: 'dev-edn8nssry67zy267.us.auth0.com',
  clientId: '1G7uNHh8gOEKAaBRLblJXrvVS0l8dmKV',
  clientSecret: 'LdoMdMiY6R4hFj5uK6WwLYh3S6j1cLcCfgCMcYlCuRVP9tbN1M1gA2VcwlZuAdGL',
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await createUser(req, res);
  } else if (req.method == "GET") {
    return await readData(req, res);
  } else if (req.method == "DELETE") {
    return await deleteUser(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

/**
 * Creates a user in Auth0, stored in the defaul Usernmae/Password database.
 * Returns the essential user attributes. 
 * 
 * @param req 
 * @param res 
 */
async function createUser(req, res) {
  const body = req.body;
  const userObject = {
    email: body.email,
    app_metadata: {
      "va_partners": {
        hospitalRole: {},
        admin: body.admin || false,
      }
    },
    name: body.name,
    password: body.password,
    connection: "Username-Password-Authentication"
  }

  try {
    const response = await managementClient.users.create(userObject);
    return res.status(200).json({
      email: response.data.email,
      name: response.data.name,
      hospitalRole: response.data.app_metadata.va_partners.hospitalRole
    }, { success: true });
  }
  catch (error) {
    return res.status(500).json({ error: `Failed to create user with error: ${error.message}` });
  }
}

async function readData(req, res) {
  try {
    var user;
    if (req.query.email != null) {
      user = await readUser(req.query.email);
    } else if (req.query.hospitalName != null) {
      getUsersByHospital(req.query.hospitalName);
    } else {
      user = await prisma.user.findMany({
        include: {
          hospitalRole: true,
          admin: true,
        },
      });
    }
    return res.status(200).json(user, { success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

export async function getUsersByHospital(hospitalId) {
  const hospital = await prisma.hospitalRole.findMany({
    where: {
      name: hospitalId,
    },
    include: {
      hospitalRole: true,
    },
  });
  let userId = [];
  hospital.forEach((hospital) => {
    hospital.hospitalRole.forEach((role) => {
      userId.push(role.userId);
    });
  });
  return prisma.user.findMany({
    where: {
      userId: { in: userId },
    },
  });
}

export async function readUser(email) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      hospitalRole: true,
      admin: true,
    },
  });
}

/**
 * Retrieves all users from Auth0.
 * @returns {Promise}
 */
export async function allUsers() {
  // Retrieve all the users in the username/password connection
  const results = await managementClient.users.getAll({
    q: "identities.connection:Username-Password-Authentication"
  });

  return results.data.map((user) => { return {
    email: user.email,
    name: user.name,
    admin: user.app_metadata.admin || false,
    hospitalRole: user.app_metadata.hospitalRole || [],
  }});
}

export async function allHospitalRoles() {
  return prisma.hospitalRole.findMany();
}


/**
 * Deletes a user from Auth0 by their user ID.
 * @returns 204 No Content
 */
async function deleteUser(req, res) {
  await managementClient.users.delete(req.body.id);
  return res.status(204);
}

/**
 * Extracts the users details from the session object
 * @param ctx 
 * @returns Null if the session is null, else user details
 */
export async function getUserFromSession(ctx) {
  const session = await getSession(ctx.req, ctx.res);

  // Session not active, redirect user to homepage
  if (session === null) {
    return null;
  }

  const userFromSession = session.user;
  const userMetadata = userFromSession['https://vapartners.org/app_metadata'];
  return {
    email: userFromSession.email,
    name: userFromSession.name,
    admin: (userMetadata.va_partners.admin !== undefined) ? userMetadata.va_partners.admin : false,
    hospitalRole: userMetadata.va_partners.hospitalRole
  };
}
