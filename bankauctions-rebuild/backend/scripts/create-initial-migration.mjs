import fs from "node:fs";
import { spawnSync } from "node:child_process";
const directory = "prisma/migrations/202611170001_checker_workflows";
fs.mkdirSync(directory, { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    "migrate",
    "diff",
    "--from-empty",
    "--to-schema-datamodel",
    "prisma/schema.prisma",
    "--script",
  ],
  { encoding: "utf8" },
);
if (result.status) {
  console.error("Migration generation failed");
  process.exit(result.status);
}
fs.writeFileSync(directory + "/migration.sql", result.stdout);
fs.writeFileSync(
  "prisma/migrations/migration_lock.toml",
  'provider = "postgresql"\n',
);
console.log(
  "Initial migration generated. Apply only to an empty database; baseline existing deployments first.",
);
