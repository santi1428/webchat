import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

const addMutedUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  console.log("muting user");
  const mutedUserId = req.body.mutedUserId;
  const userId = session?.user?.id;
  await prisma.mutedUser.create({
    data: {
      mutedUserId,
      userId,
    },
  });
  res.status(200).end();
};

const deleteMutedUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  console.log("unmuting user");
  const mutedUserId = req.body.mutedUserId;
  const userId = session?.user?.id;
  await prisma.mutedUser.deleteMany({
    where: {
      mutedUserId,
      userId,
    },
  });
  res.status(200).end();
};

const getMutedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session
) => {
  console.log("getting muted users");
  const userId = session?.user?.id;
  const mutedUsers = await prisma.mutedUser.findMany({
    where: {
      userId,
    },
    select: {
      mutedUserId: true,
    },
  });
  res
    .status(200)
    .json([...new Set(mutedUsers.map((mutedUser) => mutedUser.mutedUserId))]);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    try {
      if (req.method === "POST") {
        await addMutedUser(req, res, session);
      } else if (req.method === "GET") {
        await getMutedUsers(req, res, session);
      } else if (req.method === "DELETE") {
        await deleteMutedUser(req, res, session);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  } else {
    res.status(401).end();
  }
}
