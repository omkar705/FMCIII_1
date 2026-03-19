/**
 * Seed script: Apply migration and seed sample data.
 * Run with: npx tsx script/seed.ts
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    const sql = readFileSync(
      join(__dirname, "../migrations/0005_founder_profile.sql"),
      "utf8"
    );
    // Split by statement-breakpoint or semicolons for individual execution
    const statements = sql
      .split(/\n\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const statement of statements) {
      if (statement.startsWith("--")) continue;
      try {
        await client.query(statement);
        console.log("✅ Executed:", statement.slice(0, 60).replace(/\n/g, " ") + "...");
      } catch (err: any) {
        console.warn("⚠️  Skipped (may already exist):", err.message);
      }
    }
    console.log("\n✅ Seed complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
