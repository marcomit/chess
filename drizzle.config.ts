import type { Config } from "drizzle-kit";
import { env } from "./env";

export default {
  schema: "./server/db/schema/*.ts",
  out: "./server/db/migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL
  }
} satisfies Config;