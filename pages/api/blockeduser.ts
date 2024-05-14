import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

// const addBlockedUser = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session
// ) => {
//   console.log("muting user");
//   const mutedUserId = req.body.mutedUserId;
//   const userId = session.user.id;
//   await prisma.mutedUser.create({
//     data: {
//       mutedUserId,
//       userId,
//     },
//   });
//   res.status(200).end();
// };

// const deleteBlockedUsers = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session
// ) => {
//   console.log("unmuting user");
//   const mutedUserId = req.body.mutedUserId;
//   const userId = session.user.id;
//   await prisma.mutedUser.deleteMany({
//     where: {
//       mutedUserId,
//       userId,
//     },
//   });
//   res.status(200).end();
// };

// const getBlockedUsers = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session
// ) => {
//   console.log("getting muted users");
//   const userId = session.user.id;
//   const mutedUsers = await prisma.mutedUser.findMany({
//     where: {
//       userId,
//     },
//     select: {
//       mutedUserId: true,
//     },
//   });
//   res
//     .status(200)
//     .json([...new Set(mutedUsers.map((mutedUser) => mutedUser.mutedUserId))]);
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    try {
      if (req.method === "POST") {
        // await addBlockedUser(req, res, session);
      } else if (req.method === "GET") {
        // await getBlockedUsers(req, res, session);
      } else if (req.method === "DELETE") {
        // await deleteBlockedUsers(req, res, session);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  } else {
    res.status(401).end();
  }
}
