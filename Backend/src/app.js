const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/uploads", express.static("uploads"));

// Rate limit auth endpoints to mitigate abuse
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter, require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/restaurants", require("./routes/restaurant.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/addresses", require("./routes/address.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));
app.use("/api/favorites", require("./routes/favorite.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/admin/seeder", require("./routes/seeder.routes"));

module.exports = app;
