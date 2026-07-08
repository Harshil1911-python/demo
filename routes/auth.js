const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "serenia_secret_key";

// Register portal user
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const hashed = bcrypt.hashSync(password, 10);
  try {
    const stmt = db.prepare("INSERT INTO portal_users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, hashed);
    const token = jwt.sign({ id: result.lastInsertRowid, email }, SECRET);
    res.json({ token, name, email });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login portal user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM portal_users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email }, SECRET);
  res.json({ token, name: user.name, email });
});

module.exports = router;
