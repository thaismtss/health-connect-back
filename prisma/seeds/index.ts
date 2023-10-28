import { PrismaClient } from '@prisma/client';
import seedServices from './services';

let prisma: PrismaClient | undefined;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Não foi possível achar a variável de ambiente DATABASE_URL',
    );
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  await seedServices(prisma);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
