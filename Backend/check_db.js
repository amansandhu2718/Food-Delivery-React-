require("dotenv").config();
const db = require("./src/config/db");

async function check() {
  try {
    const r = await db.query("SELECT COUNT(*) FROM restaurants");
    const t = await db.query("SELECT COUNT(*) FROM transactions");
    const u = await db.query("SELECT COUNT(*) FROM users WHERE role = 'REST_OWNER'");
    console.log(`Restaurants: ${r.rows[0].count}`);
    console.log(`Transactions: ${t.rows[0].count}`);
    console.log(`Owners: ${u.rows[0].count}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
