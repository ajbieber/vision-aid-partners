import prisma from "client";
import { ManagementClient } from "auth0";

const managementClient = new ManagementClient({
  domain: 'dev-edn8nssry67zy267.us.auth0.com',
  clientId: '1G7uNHh8gOEKAaBRLblJXrvVS0l8dmKV',
  clientSecret: 'LdoMdMiY6R4hFj5uK6WwLYh3S6j1cLcCfgCMcYlCuRVP9tbN1M1gA2VcwlZuAdGL',
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addData(req, res);
  } else if (req.method == "GET") {
    return await readData(req, res);
  } else if (req.method == "DELETE") {
    return await deleteData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
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

export async function allUsers() {
  const results = await  managementClient.users.getAll();
  console.log(results.data);
  return results.data;
  // return prisma.user.findMany({
  //   include: {
  //     hospitalRole: true,
  //     admin: true,
  //   },
  // });
}

export async function allHospitalRoles() {
  return prisma.hospitalRole.findMany();
}

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      email: body.email,
    },
    include: {
      hospitalRole: true,
    },
  };
  console.log(
    "Request body " +
      JSON.stringify(body) +
      " create value " +
      JSON.stringify(create)
  );

  try {
    const newEntry = await prisma.user.create(create);
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

async function deleteData(req, res) {
  const deleteConfirmation = await prisma.user.delete({
    where: {
      id: req.body.id,
    },
  });
  return res.status(200).json(deleteConfirmation, { success: true });
}
