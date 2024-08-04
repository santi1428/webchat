import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import { User } from "../../../utils/types";

const getUsers = async (
  search: String,
  userId: String | null
): Promise<User[]> => {
  console.log("userId", userId);

  const blockedUsers = await prisma.blockedUser.findMany({
    where: {
      userId,
    },
    select: {
      blockedUserId: true,
    },
  });

  let blockedUserIds = blockedUsers.map(
    (blockedUser) => blockedUser.blockedUserId
  );

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
      AND: [
        {
          id: {
            notIn: blockedUserIds,
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      profilePhotoName: true,
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });
  return users;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  session
) {
  if (req.method == "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const { search } = req.query;
      console.log("search parameter", search);
      const users: User[] = await getUsers(search, session?.user?.id);
      return res.status(200).send(users);
    } else {
      return res.status(401).send("ListUser not authorized.");
    }
  }
}
