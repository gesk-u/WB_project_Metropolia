require("dotenv").config();
const connectDB = require("./config/db");
const aiRouter = require("./routes/aiRoutes");
const express = require("express");
const cors = require("cors");
const searchRouter = require("./routes/searchRoutes.js");
const savedWordRouter = require("./routes/savedWordRoutes");
const cookieParser = require("cookie-parser");
const { optionalAuth, ensureUser } = require("./middleware/authMiddleware.js");
const path = require("path");
const authRouter = require("./routes/authRoutes.js");
//for documentation
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");

const app = express();

connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.static(path.join(__dirname, "view")));

app.use(express.json());
app.use(cookieParser());
app.use(optionalAuth);

app.get("/me", (req, res) => res.json({ user: req.user }));
app.post("/guest", ensureUser, (req, res) => res.json({ user: req.user }));

app.use("/api/search", searchRouter);
app.use("/api/ai", aiRouter);
app.use("/api/saved-words", savedWordRouter);
app.use("/api/auth", authRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.use((req, res) => {
  console.log("no match:", req.method, req.originalUrl);
  res.status(404).json({ error: "unknown endpoint" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
