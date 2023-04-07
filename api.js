const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");

// Create express app
const app = express();

// Create a MySQL database connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "keeps",
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/get", (req, res) => {
  const sql = "SELECT * FROM notes";

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json(result);
  });
});

app.post("/post", (req, res) => {
  const id = req.body.id;
  const text = req.body.text;
  const date = req.body.date;

  if (!text) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const sql = "INSERT INTO notes (id,  text, date) VALUES (?,?,?)";
  const values = [id, text, date];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
});

app.delete("/delete", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ message: "Bad Request" });
  }

  db.query("DELETE FROM notes WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

// Export the app for use in other modules
module.exports = app;
