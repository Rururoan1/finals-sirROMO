const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

db.run(`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT,
  date TEXT,
  happened TEXT,
  description TEXT
)`);

// Save route
app.post("/save", (req, res) => {
  const data = req.body;
  fs.writeFileSync("data/input.json", JSON.stringify(data, null, 2));

  exec("cobc -x logic.cbl -o logic && ./logic", (err, stdout, stderr) => {
    if (err) {
      console.error("COBOL Error:", err);
      return res.status(500).send("Error running COBOL program.");
    }

    db.run(
      "INSERT INTO events (event_name, date, happened, description) VALUES (?, ?, ?, ?)",
      [data.event_name, data.date, data.happened, data.description],
      (dbErr) => {
        if (dbErr) return res.status(500).send("Error saving to database.");
        res.send("Event saved successfully!");
      }
    );
  });
});

// View route
app.get("/view", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) return res.status(500).send("Error reading database.");
    res.json(rows);
  });
});

// Edit route
app.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { event_name } = req.body;
  db.run("UPDATE events SET event_name = ? WHERE id = ?", [event_name, id], (err) => {
    if (err) return res.status(500).send("Error updating event.");
    res.send("Event updated successfully.");
  });
});

// Delete route
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM events WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Error deleting event.");
    res.send("Event deleted successfully.");
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
