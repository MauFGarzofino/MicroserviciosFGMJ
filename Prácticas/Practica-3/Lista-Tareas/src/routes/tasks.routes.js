import { Router } from "express";
import { Task } from "../models/task.model.js";

const router = Router();

/**
 * GET /tasks
 */
router.get("/", async (_req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});

/**
 * GET /tasks/:id
 */
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch {
        res.status(400).json({ message: "Invalid id" });
    }
});

/**
 * POST /tasks
 * body: { title, description?, status? }
 */
router.post("/", async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.create({ title, description, status });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
});

/**
 * PATCH /tasks/:id
 */
router.patch("/:id", async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: "Update error", error: err.message });
    }
});

/**
 * DELETE /tasks/:id
 */
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ ok: true });
    } catch {
        res.status(400).json({ message: "Invalid id" });
    }
});

export default router;
