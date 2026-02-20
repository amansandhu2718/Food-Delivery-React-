require("dotenv").config();
const db = require("./src/config/db");
db.query("SELECT COUNT(*) as c FROM restaurants").then(r => console.log("R:", r.rows[0].c));
db.query("SELECT COUNT(*) as c FROM transactions").then(r => console.log("T:", r.rows[0].c));
db.query("SELECT COUNT(*) as c FROM users WHERE role='REST_OWNER'").then(r => console.log("O:", r.rows[0].c));
setTimeout(() => process.exit(0), 2000);
