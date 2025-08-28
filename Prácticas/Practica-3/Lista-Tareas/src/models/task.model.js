import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "", trim: true },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed"],
            default: "pending",
            index: true
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
    }
);

export const Task = mongoose.model("Task", TaskSchema);
