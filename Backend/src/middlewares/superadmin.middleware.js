const roleMiddleware = require("./role.middleware");

// Middleware to exclusively allow SUPER_ADMIN
module.exports = roleMiddleware("SUPER_ADMIN");
