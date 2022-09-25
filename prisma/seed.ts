import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import users from './users.json';

async function main() {
  await prisma.user.createMany({
    data: users,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
