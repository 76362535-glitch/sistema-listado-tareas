const taskService = require("../services/taskService");

async function listTasks(req, res, next) {
  try {
    const tasks = await taskService.listTasks(req.query);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await taskService.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description = "" } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "El título es obligatorio." });
    }

    const task = await taskService.createTask({ title, description });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;

    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ message: "El título no puede estar vacío." });
    }

    const task = await taskService.updateTask(req.params.id, {
      title,
      description,
      completed
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function toggleTask(req, res, next) {
  try {
    const task = await taskService.toggleTask(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deleted = await taskService.deleteTask(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask
};
