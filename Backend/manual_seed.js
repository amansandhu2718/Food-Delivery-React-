const dotenv = require("dotenv");
dotenv.config();
const { seedDummyData, cleanupDummyData } = require("./src/utils/dbSeeder");
const db = require("./src/config/db");

async function run() {
  try {
    console.log("Cleaning...");
    await cleanupDummyData();
    console.log("Seeding...");
    await seedDummyData();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
