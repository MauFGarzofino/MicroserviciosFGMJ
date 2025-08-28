import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config.js";
import { connectDB } from "./db.js";
import tasksApi from "./routes/tasks.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true })); // <- para <form>
app.use(express.json());

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas HTML (server-rendered)
import { Task } from "./models/task.model.js";

// Home (lista)
app.get("/", async (_req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render("index", { tasks });
});

// Form nueva
app.get("/tasks/new", (_req, res) => {
    res.render("new");
});

// Crear (desde form)
app.post("/tasks/html", async (req, res) => {
    const { title, description, status } = req.body;
    await Task.create({ title, description, status });
    res.redirect("/");
});

// Eliminar (desde botón)
app.post("/tasks/:id/delete", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

// (opcional) Form editar
app.get("/tasks/:id/edit", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.redirect("/");
    res.render("edit", { task });
});
app.post("/tasks/:id/update", async (req, res) => {
    const { title, description, status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description, status });
    res.redirect("/");
});

app.use("/api/tasks", tasksApi);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});
