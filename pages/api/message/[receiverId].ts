import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handleGet = async (req, res, session) => {
  const { receiverId, cursor } = req.query;
  console.log("receiverId", receiverId);
  console.log("senderId", session.user.id);
  console.log("cursor", parseInt(cursor));
  const senderId = session.user.id;
  const messages = await prisma.message.findMany({
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    where: {
      OR: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  return res.status(200).json({ messages });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    if (req.method === "GET") {
      await handleGet(req, res, session);
    } else {
      res.status(405).json({ message: "Method not allowed." });
    }
  }
}
