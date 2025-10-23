const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/save', (req, res) => {
  const { event_name, date, happened, description } = req.body;
  const cmd = `cobc -x logic.cbl -o logic && ./logic`;

  exec(cmd, (error) => {
    if (error) {
      console.error('COBOL error:', error);
      return res.status(500).send('COBOL error.');
    }

    db.run(
      'INSERT INTO events (event_name, date, happened, description) VALUES (?, ?, ?, ?)',
      [event_name, date, happened, description],
      function (err) {
        if (err) return res.status(500).send(err.message);
        res.json({ message: 'Saved successfully!' });
      }
    );
  });
});

app.get('/view', (req, res) => {
  db.all('SELECT * FROM events', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
