import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import { takeCoverage } from "v8";

const getUserNotifications = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) => {
  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: session?.user?.id,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          lastName: true,
          profilePhotoURL: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({ notifications });
};

const deleteUserNotification = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) => {
  const { id, type } = req.body;
  if (type === "all") {
    await prisma.notification.deleteMany({
      where: {
        receiverId: session?.user?.id,
      },
    });
    return res.status(200).json({});
  } else if (type === "single") {
    const notification = await prisma.notification.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ notification });
  } else if (type === "chat") {
    console.log("deleting chat notifications");
    await prisma.notification.deleteMany({
      where: {
        receiverId: session?.user?.id,
        senderId: id,
      },
    });
    return res.status(200);
  }

  return res.status(400).json({
    message: "Invalid type",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    try {
      if (req.method === "GET") {
        console.log("returning notifications");
        await getUserNotifications(req, res, session);
      } else if (req.method === "DELETE") {
        await deleteUserNotification(req, res, session);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  } else {
    res.status(401).end();
  }
}
