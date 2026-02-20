require("dotenv").config();
const { seedDummyData } = require("./src/utils/dbSeeder");

(async () => {
    try {
        console.log("Starting database seed...");
        await seedDummyData();
        console.log("Seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
})();
