const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./database");
const app = express();
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  req.session.user ? next() : res.redirect("/login");
};

const preventJoiningPastSessions = async (req, res, next) => {
  try {
    const { session_id } = req.body;
    const result = await pool.query("SELECT * FROM sessions WHERE id = $1", [session_id]);
    if (!result.rows.length || new Date(result.rows[0].date) < new Date()) {
      return res.redirect("/player-dashboard");
    }
    next();
  } catch (err) {
    console.error("Error preventing past session join:", err);
    res.redirect("/player-dashboard");
  }
};

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length && await bcrypt.compare(password, user.rows[0].password)) {
      req.session.user = user.rows[0];
      return res.redirect(user.rows[0].role === "admin" ? "/admin-dashboard" : "/player-dashboard");
    }
    res.redirect("/login?error=Invalid+email+or+password");
  } catch (error) {
    console.error("Login error:", error);
    res.redirect("/login?error=An+error+occurred");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role]
    );
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    res.redirect("/register?error=Failed+to+register");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.post("/create-sport", isAuthenticated, async (req, res) => {
  try {
    await pool.query("INSERT INTO sports (name) VALUES ($1)", [req.body.name]);
    res.redirect("/admin-dashboard");
  } catch (error) {
    console.error("Error adding sport:", error);
    res.redirect("/admin-dashboard?error=Failed+to+add+sport");
  }
});

app.post("/delete-session", isAuthenticated, async (req, res) => {
  try {
    await pool.query("DELETE FROM sessions WHERE id = $1", [req.body.session_id]);
    res.redirect("/admin-dashboard");
  } catch (error) {
    console.error("Error deleting session:", error);
    res.redirect("/admin-dashboard?error=Failed+to+delete");
  }
});

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
