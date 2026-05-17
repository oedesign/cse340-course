import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/**
 * Check that DB_URL was loaded from .env.
 */
console.log("DB_URL loaded:", process.env.DB_URL ? "yes" : "no");

if (!process.env.DB_URL) {
    throw new Error(
        "DB_URL is missing. Make sure your .env file is located at C:\\cse340-course\\.env and contains DB_URL."
    );
}

/**
 * PostgreSQL connection pool.
 *
 * Since your database is hosted on Render, SSL is usually required,
 * especially when connecting from your local computer.
 */
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Database wrapper.
 */
let db = null;

if (process.env.NODE_ENV === "development" && process.env.ENABLE_SQL_LOGGING === "true") {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;

                console.log("Executed query:", {
                    text: text.replace(/\s+/g, " ").trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });

                return res;
            } catch (error) {
                console.error("Error in query:", {
                    text: text.replace(/\s+/g, " ").trim(),
                    error: error.message
                });

                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    db = pool;
}

/**
 * Test database connection.
 */
const testConnection = async () => {
    try {
        const result = await db.query("SELECT NOW() as current_time");
        console.log("Database connection successful:", result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

export { db as default, testConnection };