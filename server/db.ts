import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const dbUrl = new URL(process.env.DATABASE_URL);
const caPemPath = path.resolve(import.meta.dirname, "..", "attached_assets", "ca.pem");

const poolConfig: any = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  database: dbUrl.pathname.slice(1),
  user: dbUrl.username,
  password: dbUrl.password,
  ssl: fs.existsSync(caPemPath) ? {
    rejectUnauthorized: true,
    ca: fs.readFileSync(caPemPath).toString()
  } : {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected database connection error:', err);
});

export const db = drizzle(pool, { schema });
