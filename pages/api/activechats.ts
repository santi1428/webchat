import { prisma } from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

const getActiveChats = async (id: String) => {
  let activeChats = await prisma.message.findMany({
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

  const blockedUsers = await prisma.blockedUser.findMany({
    where: {
      userId: id,
    },
    select: {
      blockedUserId: true,
    },
  });

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  activeChats = await Promise.all(
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

  activeChats = activeChats.filter((chat) => {
    let isInBlockedUsers = blockedUsers.find((blockedUser) => {
      return chat.id === blockedUser.blockedUserId;
    });

    return !isInBlockedUsers;
  });

  return activeChats;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const activeChats = await getActiveChats(session?.user?.id);
      return res.status(200).json(activeChats);
    } else {
      return res.status(401).end();
    }
  } else {
    return res.status(405).end();
  }
}
