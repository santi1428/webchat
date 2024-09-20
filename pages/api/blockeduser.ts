import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

const addBlockedUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  const blockedUserId = req.body.blockedUserId;
  const userId = session?.user?.id;
  const blockedUser = await prisma.blockedUser.findFirst({
    where: {
      blockedUserId,
      userId,
    },
  });
  if (blockedUser) {
    return res.status(400).end();
  }
  console.log("blocking user");
  await prisma.blockedUser.create({
    data: {
      blockedUserId,
      userId,
    },
  });
  return res.status(200).end();
};

const deleteBlockedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  console.log("deleting blocked user");
  const blockedUserId = req.body.blockedUserId;
  const userId = session?.user?.id;
  await prisma.blockedUser.deleteMany({
    where: {
      blockedUserId,
      userId,
    },
  });
  res.status(200).end();
};

const getBlockedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  console.log("Getting blocked users");
  const userId = session?.user?.id;
  const blockedUsers = await prisma.blockedUser.findMany({
    where: {
      userId,
    },
    include: {
      blockedUser: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          profilePhotoURL: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json(blockedUsers.map((blockedUser) => blockedUser.blockedUser));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    try {
      if (req.method === "POST") {
        await addBlockedUser(req, res, session);
      } else if (req.method === "GET") {
        await getBlockedUsers(req, res, session);
      } else if (req.method === "DELETE") {
        await deleteBlockedUsers(req, res, session);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  } else {
    res.status(401).end();
  }
}
