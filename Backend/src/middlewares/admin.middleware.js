const roleMiddleware = require("./role.middleware");

// Keep admin middleware for backward compatibility
// But use the new role middleware internally
module.exports = roleMiddleware("ADMIN", "SUPER_ADMIN");
