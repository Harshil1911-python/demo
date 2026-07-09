const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../db/database");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// IMPORTANT: /my-forms must come BEFORE /:slug or Express will treat "my-forms" as a slug

// Get my forms
router.get("/my-forms", auth, (req, res) => {
  const forms = db.prepare("SELECT * FROM forms WHERE portal_user_id = ? ORDER BY created_at DESC").all(req.user.id);
  res.json(forms.map(f => ({ ...f, fields: JSON.parse(f.fields) })));
});

// Create form (now includes redirect_url)
router.post("/create", auth, (req, res) => {
  const { form_name, fields, redirect_url } = req.body;
  if (!form_name || !fields)
    return res.status(400).json({ error: "form_name and fields required" });

  const slug = nanoid(8);
  db.prepare("INSERT INTO forms (portal_user_id, form_name, form_slug, fields, redirect_url) VALUES (?, ?, ?, ?, ?)")
    .run(req.user.id, form_name, slug, JSON.stringify(fields), redirect_url || "");

  res.json({ slug, form_name, link: `/form/${slug}` });
});

// Delete form
router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM forms WHERE id = ? AND portal_user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Update redirect URL
router.patch("/:id/redirect", auth, (req, res) => {
  const { redirect_url } = req.body;
  db.prepare("UPDATE forms SET redirect_url = ? WHERE id = ? AND portal_user_id = ?")
    .run(redirect_url || "", req.params.id, req.user.id);
  res.json({ success: true });
});

// Get form by slug (public) — MUST be last
router.get("/:slug", (req, res) => {
  const form = db.prepare("SELECT * FROM forms WHERE form_slug = ?").get(req.params.slug);
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json({ ...form, fields: JSON.parse(form.fields) });
});

module.exports = router;
