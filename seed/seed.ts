import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

async function main() {
  const prisma = new PrismaClient();
  await prisma.cabin.deleteMany();

  await prisma.cabin.createMany({ data: sampleData.cabins });

  console.log('Database seeded successfully!');
}

main();
