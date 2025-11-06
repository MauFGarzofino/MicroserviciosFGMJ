import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4001;

// In-memory "DB"
const products = new Map(); // id -> {id, name, price, stock}

// Health
app.get("/health", (_, res) => res.json({ ok: true, service: "products" }));

// List
app.get("/products", (_, res) => {
    res.json([...products.values()]);
});

// Get by id
app.get("/products/:id", (req, res) => {
    const p = products.get(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
});

// Create
app.post("/products", (req, res) => {
    const { name, price = 0, stock = 0 } = req.body || {};
    if (!name) return res.status(400).json({ message: "name required" });
    const id = nanoid(8);
    const product = { id, name, price: Number(price), stock: Number(stock) };
    products.set(id, product);
    res.status(201).json(product);
});

// Update (PUT = reemplazo total simple)
app.put("/products/:id", (req, res) => {
    const { name, price = 0, stock = 0 } = req.body || {};
    if (!products.has(req.params.id)) return res.status(404).json({ message: "Product not found" });
    if (!name) return res.status(400).json({ message: "name required" });
    const updated = { id: req.params.id, name, price: Number(price), stock: Number(stock) };
    products.set(req.params.id, updated);
    res.json(updated);
});

// Patch (parcial)
app.patch("/products/:id", (req, res) => {
    const curr = products.get(req.params.id);
    if (!curr) return res.status(404).json({ message: "Product not found" });
    const { name, price, stock } = req.body || {};
    const updated = {
        ...curr,
        ...(name !== undefined ? { name } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(stock !== undefined ? { stock: Number(stock) } : {})
    };
    products.set(req.params.id, updated);
    res.json(updated);
});

// Delete
app.delete("/products/:id", (req, res) => {
    if (!products.has(req.params.id)) return res.status(404).json({ message: "Product not found" });
    products.delete(req.params.id);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`[products-svc] listening :${PORT}`));
