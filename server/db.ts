import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

const dbUrl =
  "postgres://avnadmin:AVNS_zeE6oufcsDGsHvWpShG@dbpos-mhdalhzau.e.aivencloud.com:18498/defaultdb?sslmode=require";

if (dbUrl) {
  throw new Error("DATABASE_URL is not set");
}

c;
const caPemPath = path.resolve(
  import.meta.dirname,
  "..",
  "attached_assets",
  "ca.pem",
);

const poolConfig: any = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  database: dbUrl.pathname.slice(1),
  user: dbUrl.username,
  password: dbUrl.password,
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
