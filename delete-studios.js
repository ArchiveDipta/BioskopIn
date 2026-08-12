const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.studio.deleteMany({});
  console.log('Deleted all studios');
}
main().finally(() => prisma.$disconnect());
