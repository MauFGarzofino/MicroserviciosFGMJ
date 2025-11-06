import express from "express";
const app = express();
const PORT = process.env.PORT || 4001;

// Base de datos en memoria (simulada)
const users = {
    "u1": { id: "u1", name: "Ana", email: "ana@example.com" },
    "u2": { id: "u2", name: "Mau", email: "mau@example.com" }
};

app.get("/health", (_, res) => res.json({ ok: true }));

app.get("/users/:id", (req, res) => {
    const user = users[req.params.id];
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

app.listen(PORT, () => {
    console.log(`[users-svc] listening on :${PORT}`);
});
