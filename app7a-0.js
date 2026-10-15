
// CRUD Operations of Book Store
require("dotenv").config();
const express = require("express");
const mysql = require("mysql8");
const path = require("path");

const app = express();

app.use(express.json());

// Serve HTML, CSS and other files from book folder
app.use(express.static(path.join(__dirname, "book")));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("MySQL Connection Error:", err.message);
        return;
    }

    console.log("Connected to MySQL");
});

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "book", "index.html"));
});

// GET ALL BOOKS
app.get("/books", (req, res) => {
    db.query("SELECT * FROM book", (err, result) => {
        if (err) {
            console.error("Get Books Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json(result);
    });
});

// GET ALL BOOK IDs FOR DROPDOWN
app.get("/bookids", (req, res) => {
    db.query(
        "SELECT book_id FROM book ORDER BY book_id",
        (err, result) => {
            if (err) {
                console.error("Book IDs Error:", err.message);
                return res.status(500).json({ error: err.message });
            }

            console.log("Book IDs sent:", result);
            res.json(result);
        }
    );
});

// GET ONE BOOK
app.get("/books/:bno", (req, res) => {
    db.query(
        "SELECT * FROM book WHERE book_id = ?",
        [req.params.bno],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result);
        }
    );
});

// INSERT BOOK
app.post("/books", (req, res) => {
    const {
        book_id,
        title,
        author,
        category,
        price,
        stock
    } = req.body;

    db.query(
        `INSERT INTO book
    (book_id, title, author, category, price, stock)
VALUES(?, ?, ?, ?, ?, ?)`,
        [book_id, title, author, category, price, stock],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ message: "Book Inserted" });
        }
    );
});

// UPDATE BOOK
app.put("/books/:bno", (req, res) => {
    const { title, author, category, price, stock } = req.body;

    db.query(
        `UPDATE book
         SET title = ?, author = ?, category = ?, price = ?, stock = ?
    WHERE book_id = ? `,
        [title, author, category, price, stock, req.params.bno],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Book NOT found");
            }

            res.send("Book Updated");
        }
    );
});

// DELETE BOOK
app.delete("/books/:bno", (req, res) => {
    db.query(
        "DELETE FROM book WHERE book_id = ?",
        [req.params.bno],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Book NOT found to delete");
            }

            res.send("Book Deleted");
        }
    );
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});