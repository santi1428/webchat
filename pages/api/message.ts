import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

const insertMessage = async ({ message, senderId, receiverId }) => {
  console.log("inserting message");
  return prisma.message.create({
    data: {
      content: message,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const { message, receiverId } = req.body;
      console.log("message received from client", message);
      if (message.trim().length == 0) {
        return res.status(400).json({ message: "Message cannot be empty." });
      } else {
        const senderId = session.user.id;
        await insertMessage({
          message,
          senderId,
          receiverId,
        });
        return res.status(200).json({ message });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}
