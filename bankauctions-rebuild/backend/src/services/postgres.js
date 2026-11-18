import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// PostgreSQL is the sole application store. Connection errors are surfaced,
// never replaced with synthetic inventory or volatile user accounts.
export const db = new PrismaClient({
  transactionOptions: { maxWait: 15000, timeout: 30000 },
});
