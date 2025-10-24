 const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();

// ✅ Enable CORS for all domains
app.use(cors());

app.use(express.json());
app.use(express.static("public"));

 
 

const db = new sqlite3.Database("./database.db");

// --- ROUTES ---
app.post("/save", (req, res) => {
  const { event_name, date, happened, description } = req.body;
  db.run(
    `INSERT INTO events (event_name, date, happened, description)
     VALUES (?, ?, ?, ?)`,
    [event_name, date, happened, description],
    function (err) {
      if (err) res.status(500).send("Database error");
      else res.send("Event saved!");
    }
  );
});

app.get("/view", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) res.status(500).send("Error fetching events");
    else res.json(rows);
  });
});

app.delete("/delete/:id", (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], (err) => {
    if (err) res.status(500).send("Delete failed");
    else res.send("Deleted");
  });
});

app.put("/edit/:id", (req, res) => {
  const { event_name } = req.body;
  db.run(
    `UPDATE events SET event_name = ? WHERE id = ?`,
    [event_name, req.params.id],
    (err) => {
      if (err) res.status(500).send("Edit failed");
      else res.send("Updated");
    }
  );
});

app.listen(10000, () => console.log("✅ Server running on port 10000"));
// --- END ROUTES ---