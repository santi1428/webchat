import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import { User } from "../../../utils/types";

const getUsers = async (search: String): Promise<User[]> => {
  console.log("querying database getUserByID");
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          lastName: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
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
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const { search } = req.query;
      console.log("search parameter", search);
      const users: User[] = await getUsers(search);
      return res.status(200).send(users);
    } else {
      return res.status(401).send("User not authorized.");
    }
  }
}
