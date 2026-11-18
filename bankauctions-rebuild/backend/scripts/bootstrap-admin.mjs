import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const email = String(process.argv[2] || "")
  .trim()
  .toLowerCase();
if (!email.includes("@"))
  throw new Error("Usage: node scripts/bootstrap-admin.mjs REGISTERED_EMAIL");
try {
  await db.$transaction(
    async (tx) => {
      if (await tx.user.count({ where: { role: "ADMIN" } }))
        throw new Error(
          "An administrator already exists. Use the administrator workspace to manage staff.",
        );
      const user = await tx.user.findUnique({ where: { email } });
      if (!user || !user.isActive)
        throw new Error(
          "Register an active account through the application first.",
        );
      await tx.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          actorName: user.fullName,
          actorRole: "ADMIN",
          action: "INITIAL_ADMIN_BOOTSTRAP",
          entityType: "USER",
          entityId: user.id,
        },
      });
    },
    { isolationLevel: "Serializable" },
  );
  console.log("Initial administrator enabled. Sign out and log in again.");
} finally {
  await db.$disconnect();
}
