const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Register via form (end user)
router.post("/:slug/register", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE form_slug = ?").get(req.params.slug);
  if (!form) return res.status(404).json({ error: "Form not found" });

  const { email, password, ...extra } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const existing = db.prepare("SELECT * FROM form_entries WHERE form_id = ? AND email = ?").get(form.id, email);
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const hashed = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO form_entries (form_id, email, password, extra_data) VALUES (?, ?, ?, ?)")
    .run(form.id, email, hashed, JSON.stringify(extra));

  res.json({ success: true, message: "Registered successfully!" });
});

// Login via form (end user)
router.post("/:slug/login", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE form_slug = ?").get(req.params.slug);
  if (!form) return res.status(404).json({ error: "Form not found" });

  const { email, password } = req.body;
  const entry = db.prepare("SELECT * FROM form_entries WHERE form_id = ? AND email = ?").get(form.id, email);
  if (!entry || !bcrypt.compareSync(password, entry.password))
    return res.status(401).json({ error: "Invalid credentials" });

  res.json({ success: true, message: "Login successful!", email });
});

// Get all entries for a form (portal user only)
router.get("/:formId", auth, (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE id = ? AND portal_user_id = ?").get(req.params.formId, req.user.id);
  if (!form) return res.status(403).json({ error: "Not authorized" });

  const entries = db.prepare("SELECT id, email, extra_data, created_at FROM form_entries WHERE form_id = ?").all(req.params.formId);
  res.json(entries.map(e => ({ ...e, extra_data: JSON.parse(e.extra_data || "{}") })));
});

module.exports = router;
