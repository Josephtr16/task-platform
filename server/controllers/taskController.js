import Task from "../models/Task.js";

// POST /api/tasks  (protected)
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      deadline,
      status,
    });

    res.status(201).json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tasks  (protected)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/tasks/:id  (protected)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, priority, deadline, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (deadline !== undefined) task.deadline = deadline;
    if (status !== undefined) task.status = status;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    console.log("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tasks/:id  (protected)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
