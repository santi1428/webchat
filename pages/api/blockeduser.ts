import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

// Helper to ensure userId is a string (prevents Type errors)
const getUserId = (session: any) => session?.user?.id as string;

const addBlockedUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  const { blockedUserId } = req.body;

  if (!blockedUserId || typeof blockedUserId !== "string") {
    return res.status(400).json({ error: "Invalid blockedUserId" });
  }

  // Prevent user from blocking themselves
  if (blockedUserId === userId) {
    return res.status(400).json({ error: "You cannot block yourself" });
  }

  try {
    // Attempt to create. If it fails (duplicate), catch the error.
    // This saves one read query compared to findFirst() + create()
    await prisma.blockedUser.create({
      data: {
        blockedUserId,
        userId,
      },
    });
    return res.status(200).end();
  } catch (error: any) {
    // Unique constraint violation code (P2002) - means already blocked
    if (error.code === "P2002") {
      return res.status(400).json({ error: "User already blocked" });
    }
    throw error; // Let the main handler catch 500s
  }
};

const deleteBlockedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  const { blockedUserId } = req.body;

  if (!blockedUserId || typeof blockedUserId !== "string") {
    return res.status(400).json({ error: "Invalid blockedUserId" });
  }

  // deleteMany is safe; it won't throw if 0 records are found.
  await prisma.blockedUser.deleteMany({
    where: {
      blockedUserId,
      userId,
    },
  });

  return res.status(200).end();
};

const getBlockedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
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

  // Return just the profile data, filtering out any potentially null relations
  const users = blockedUsers
    .map((record) => record.blockedUser)
    .filter(Boolean); // Safety filter

  return res.status(200).json(users);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Check authentication first
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).end();
  }

  const userId = session.user.id as string;

  try {
    switch (req.method) {
      case "GET":
        return await getBlockedUsers(req, res, userId);
      case "POST":
        return await addBlockedUser(req, res, userId);
      case "DELETE":
        return await deleteBlockedUsers(req, res, userId);
      default:
        // 2. Handle unsupported methods explicitly
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
