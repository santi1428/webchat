import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

const getUsers = async (
  search: string,
  userId: string | null
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
      profilePhotoURL: true,
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
    const session : Session = await getServerSession(req, res, authOptions);
    if (session) {
      let { search } = req.query;
      if (Array.isArray(search)) {
        search = search.join("");
      }
      console.log("search parameter", search);
      const users: User[] = await getUsers(search, session?.user?.id);
      return res.status(200).send(users);
    } else {
      return res.status(401).send("ListUser not authorized.");
    }
  }
}
