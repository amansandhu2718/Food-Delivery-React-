require("dotenv").config();
const db = require("./src/config/db");

async function resetDatabase() {
  const client = await db.pool.connect();
  try {
    console.log("Starting full database reset...");
    await client.query("BEGIN");

    const tables = [
      "transaction_items", "transactions", "cart",
      "restaurant_menu", "restaurant_stats", "product_stats",
      "user_favorites", "complaints", "chat_history", "email_verifications",
      "refresh_tokens", "user_addresses", "products", "restaurants", "users"
    ];

    for (const table of tables) {
      console.log(`Truncating ${table}...`);
      await client.query(`TRUNCATE TABLE ${table} CASCADE`);
    }

    await client.query("COMMIT");
    console.log("Database reset complete. Please restart server to seed SUPER_ADMIN.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Reset failed", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

resetDatabase();
