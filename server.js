const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db/database");

const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const entryRoutes = require("./routes/entries");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/entries", entryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Serenia Portal API is running!" });
});

app.listen(PORT, () => {
  console.log(`Serenia Portal backend running on port ${PORT}`);
});
