const { seedDummyData, cleanupDummyData } = require("../utils/dbSeeder");

exports.seed = async (req, res) => {
  try {
    await seedDummyData();
    res.status(200).json({ message: "Dummy data seeded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to seed dummy data" });
  }
};

exports.cleanup = async (req, res) => {
  try {
    await cleanupDummyData();
    res.status(200).json({ message: "Dummy data cleaned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clean dummy data" });
  }
};
