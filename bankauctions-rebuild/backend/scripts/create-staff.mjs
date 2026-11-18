import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
const [email, fullName, phone, role = "ADMIN"] = process.argv.slice(2);
const password = process.env.BOOTSTRAP_PASSWORD;
if (
  !email ||
  !fullName ||
  !/^\d{10}$/.test(phone || "") ||
  !password ||
  password.length < 12 ||
  !["ADMIN", "CHECKER", "ENGINEER", "MARKETING"].includes(role)
)
  throw new Error(
    'Usage: set BOOTSTRAP_PASSWORD (12+ chars) in process environment, then node scripts/create-staff.mjs EMAIL "FULL NAME" PHONE ROLE.',
  );
try {
  const user = await db.user.create({
    data: {
      email: email.trim().toLowerCase(),
      fullName,
      phone,
      role,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
    },
  });
  console.log(`Created ${user.role} account for ${user.email}.`);
} finally {
  await db.$disconnect();
}
