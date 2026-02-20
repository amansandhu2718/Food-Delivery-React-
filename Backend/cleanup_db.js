require("dotenv").config();
const { cleanupDummyData } = require("./src/utils/dbSeeder");

(async () => {
    try {
        console.log("Starting database cleanup...");
        await cleanupDummyData();
        console.log("Cleanup completed!");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed", error);
        process.exit(1);
    }
})();
