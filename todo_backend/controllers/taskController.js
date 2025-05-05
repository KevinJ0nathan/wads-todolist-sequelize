import Task from '../models/toDo.js';
import jwt from 'jsonwebtoken';

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is missing
  if (!authHeader) {
    console.error("Authorization header is missing");
    throw new Error("No token provided");
  }

  // Check if the header starts with 'Bearer '
  if (!authHeader.startsWith("Bearer ")) {
    console.error("Invalid token format, expected 'Bearer <token>'");
    throw new Error("Invalid token format");
  }

  // Extract token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token missing after 'Bearer'");
    throw new Error("Token missing");
  }

  try {
    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.uid; // Assuming 'uid' is the field where user ID is stored
  } catch (err) {
    console.error("Failed to verify JWT:", err);
    throw new Error("Invalid or expired token");
  }
};
// Create a new task
export const createTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title, description, dueDate } = req.body;

    const task = await Task.create({
      userId,
      title,
      description,
      dueDate,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Get all tasks for a user (from JWT)
export const getTasksByUser = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const tasks = await Task.findAll({ where: { userId } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, completed, dueDate } = req.body;

  try {
    const userId = getUserIdFromToken(req);
    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const userId = getUserIdFromToken(req);
    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
