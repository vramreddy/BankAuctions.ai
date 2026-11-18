import dotenv from "dotenv";
import pg from "pg";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
dotenv.config({ path: ".env.test.local", override: true });
const url = new URL(process.env.DATABASE_URL);
url.pathname = "/postgres";
const client = new pg.Client({ connectionString: url.href });
await client.connect();
if (
  !(
    await client.query("SELECT 1 FROM pg_database WHERE datname=$1", [
      "bankauctions_test",
    ])
  ).rowCount
)
  await client.query("CREATE DATABASE bankauctions_test");
await client.end();
for (const args of [["generate"], ["db", "push", "--skip-generate"]]) {
  const result = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", ...args],
    { stdio: "inherit", env: process.env },
  );
  if (result.status) process.exit(result.status);
}
console.log("Isolated PostgreSQL schema ready.");
