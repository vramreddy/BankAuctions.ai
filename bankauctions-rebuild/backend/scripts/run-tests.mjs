import dotenv from "dotenv";
import { spawnSync } from "node:child_process";
import pg from "pg";
dotenv.config({ path: ".env.test.local", override: true });
const url = new URL(process.env.DATABASE_URL || "");
if (
  url.hostname !== "127.0.0.1" ||
  url.port !== "55432" ||
  url.pathname !== "/bankauctions_test"
)
  throw new Error(
    "Tests require the isolated localhost:55432/bankauctions_test database.",
  );
const schema = "test_" + Date.now();
url.searchParams.set("schema", schema);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(`CREATE SCHEMA "${schema}"`);
let status = 1;
try {
  const env = {
    ...process.env,
    DATABASE_URL: url.href,
    NODE_ENV: "test",
    SMTP_HOST: "",
    MAIL_FROM: "",
  };
  const push = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "db", "push", "--skip-generate"],
    { stdio: "inherit", env },
  );
  if (push.status) throw new Error("Could not prepare isolated test schema");
  const tests = spawnSync(
    process.execPath,
    ["--test", "--test-concurrency=1"],
    { stdio: "inherit", env },
  );
  status = tests.status ?? 1;
} finally {
  if (!/^test_\d+$/.test(schema)) throw new Error("Invalid test schema");
  await client.query(`DROP SCHEMA "${schema}" CASCADE`);
  await client.end();
}
process.exitCode = status;
