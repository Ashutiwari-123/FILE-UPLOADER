const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

const db = new sqlite3.Database("./documents.db");
db.run(`CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  filepath TEXT,
  filesize INTEGER,
  created_at TEXT
)`);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs allowed"));
    }
    cb(null, true);
  }
});

app.post("/documents/upload", upload.single("file"), (req, res) => {
  const { filename, path: filepath, size } = req.file;

  db.run(
    `INSERT INTO documents (filename, filepath, filesize, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [filename, filepath, size],
    function () {
      res.json({ message: "Uploaded", id: this.lastID });
    }
  );
});

app.get("/documents", (req, res) => {
  db.all("SELECT * FROM documents", (err, rows) => res.json(rows));
});

app.get("/documents/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: "Not found" });
    res.download(row.filepath, row.filename);
  });
});

app.delete("/documents/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: "Not found" });

    fs.unlinkSync(row.filepath);

    db.run("DELETE FROM documents WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted" });
  });
});

app.listen(5000, () => console.log("Backend running at port 5000"));
