import { defineConfig } from "drizzle-kit";
import * as fs from "fs";
import * as path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const dbUrl = new URL(process.env.DATABASE_URL);
const caPemPath = path.resolve(process.cwd(), "attached_assets", "ca.pem");
const sslMode = dbUrl.searchParams.get('sslmode');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 5432,
    database: dbUrl.pathname.slice(1),
    user: dbUrl.username,
    password: dbUrl.password,
    ssl: sslMode === 'disable' ? false : (fs.existsSync(caPemPath) ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(caPemPath, 'utf-8')
    } : {
      rejectUnauthorized: false
    })
  },
});
