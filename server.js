const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

// Connect to database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to SQLite database.");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT,
    date TEXT,
    happened TEXT,
    description TEXT
  )
`);

// Serve frontend index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === API ROUTES ===
app.post("/save", (req, res) => {
  const { event_name, date, happened, description } = req.body;
  db.run(
    `INSERT INTO events (event_name, date, happened, description) VALUES (?, ?, ?, ?)`,
    [event_name, date, happened, description],
    (err) => {
      if (err) return res.status(500).send("Error saving event");
      res.send("Event saved successfully!");
    }
  );
});

app.get("/view", (req, res) => {
  db.all("SELECT * FROM events", (err, rows) => {
    if (err) return res.status(500).send("Error retrieving events");
    res.json(rows);
  });
});

app.delete("/delete/:id", (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).send("Error deleting event");
    res.send("Event deleted successfully!");
  });
});

app.put("/edit/:id", (req, res) => {
  db.run(
    `UPDATE events SET event_name = ? WHERE id = ?`,
    [req.body.event_name, req.params.id],
    (err) => {
      if (err) return res.status(500).send("Error updating event");
      res.send("Event updated successfully!");
    }
  );
});

// Render-compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
