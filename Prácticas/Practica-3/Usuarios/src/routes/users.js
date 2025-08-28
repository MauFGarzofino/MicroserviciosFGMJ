import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Lista de usuarios
router.get("/", async (_req, res) => {
    const [rows] = await pool.query(
        "SELECT id, name, email, created_at FROM users ORDER BY id DESC"
    );
    res.render("index", { users: rows });
});

// Form para nuevo usuario
router.get("/users/new", (_req, res) => {
    res.render("new");
});

// Crear usuario
router.post("/users", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.redirect("/users/new");
    await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.redirect("/");
});

// Eliminar usuario
router.post("/users/:id/delete", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.redirect("/");
});

export default router;
