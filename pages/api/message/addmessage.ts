import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";

const insertMessage = async ({ message, senderId, receiverId }) => {
  console.log("inserting message");
  return prisma.message.create({
    data: {
      content: message,
      senderId,
      receiverId,
    },
  });
};

const addMessageNotification = async ({ senderId, receiverId, message }) => {
  return prisma.notification.create({
    data: {
      senderId,
      receiverId,
      message,
    },
  });
};

const handlePost = async (req, res, session) => {
  const { message, receiverId } = req.body;
  console.log("req.body", req.body);
  console.log("message received from client", message);
  if (message.trim().length == 0) {
    return res.status(400).json({
      error: "Message cannot be empty.",
    });
  } else {
    const senderId = session?.user?.id;
    await insertMessage({
      message,
      senderId,
      receiverId,
    });
    await addMessageNotification({
      senderId,
      receiverId,
      message,
    });
    return res.status(200).json({ message });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method === "POST") {
      await handlePost(req, res, session);
    } else {
      res.status(405).json({ message: "Method not allowed." });
    }
  } else {
    res.status(401).json({ message: "Unauthorized." });
  }
}
