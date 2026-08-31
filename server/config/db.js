import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL Connection Pool
 * Abstraksi konfigurasi database PostgreSQL
 */
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
);

export default pool;
