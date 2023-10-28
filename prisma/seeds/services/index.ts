import { PrismaClient } from '@prisma/client';
import data from '../../../services.json';

export default async function seedServices(prisma: PrismaClient) {
  try {
    await prisma.services.createMany({
      data,
      skipDuplicates: true,
    });
  } catch (e) {
    console.error(e);
  }
}
