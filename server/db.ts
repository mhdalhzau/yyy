import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

const dbUrl = process.env.DATABASE_URL ||
  "postgres://avnadmin:AVNS_zeE6oufcsDGsHvWpShG@dbpos-mhdalhzau.e.aivencloud.com:18498/defaultdb?sslmode=require";

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set");
}

const url = new URL(dbUrl);
const caPemPath = path.resolve(
  import.meta.dirname,
  "..",
  "attached_assets",
  "ca.pem",
);

const poolConfig: any = {
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: fs.existsSync(caPemPath)
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(caPemPath).toString(),
      }
    : {
        rejectUnauthorized: false,
      },
};

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected database connection error:", err);
});

export const db = drizzle(pool, { schema });
