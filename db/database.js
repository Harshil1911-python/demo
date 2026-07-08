const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "serenia.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS portal_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portal_user_id INTEGER NOT NULL,
    form_name TEXT NOT NULL,
    form_slug TEXT UNIQUE NOT NULL,
    fields TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portal_user_id) REFERENCES portal_users(id)
  );

  CREATE TABLE IF NOT EXISTS form_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    extra_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id)
  );
`);

module.exports = db;
