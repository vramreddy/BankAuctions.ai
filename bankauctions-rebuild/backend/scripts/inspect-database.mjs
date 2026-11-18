import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
try {
  await db.$connect();
  const tables =
    await db.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log(
    JSON.stringify({
      connected: true,
      tables: tables.map((row) => row.table_name),
    }),
  );
} catch (error) {
  console.log(
    JSON.stringify({ connected: false, code: error.code || "NETWORK" }),
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
