const db = require("../config/db");

async function initComplaintsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Complaints table initialized");
  } catch (err) {
    console.error("Error initializing complaints table:", err);
  }
}

if (require.main === module) {
  initComplaintsTable().then(() => process.exit());
}

module.exports = initComplaintsTable;
