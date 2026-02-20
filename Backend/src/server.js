require("dotenv").config();
const app = require("./app");
const initDb = require("./config/initDb");
require("dotenv").config();
const { initSocket } = require("./Socket");
const http = require("http");

const PORT = process.env.PORT || 5001;

(async () => {
  await initDb();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
