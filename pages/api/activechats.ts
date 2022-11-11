import { prisma } from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

const getActiveChats = async (id: String) => {
  const activeChats = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: id,
        },
        {
          receiverId: id,
        },
      ],
    },
    select: {
      receiver: {
        select: {
          id: true,
          name: true,
          lastName: true,
          profilePhotoName: true,
        },
      },
    },
    distinct: ["senderId", "receiverId"],
  });

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  return await Promise.all(
    activeChats.map(async (chat) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            {
              senderId: id,
              receiverId: chat.receiver.id,
            },
            {
              senderId: chat.receiver.id,
              receiverId: id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        ...chat.receiver,
        lastMessage,
      };
    })
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const activeChats = await getActiveChats(session.user.id);
      return res.status(200).json(activeChats);
    } else {
      return res.status(401).end();
    }
  } else {
    return res.status(405).end();
  }
}
