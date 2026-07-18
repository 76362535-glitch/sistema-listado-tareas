const crypto = require("crypto");
const repository = require("../repositories/taskRepository");

async function listTasks(filters = {}) {
  let tasks = await repository.readAll();

  const status = filters.status;
  const search = String(filters.search || "").trim().toLowerCase();

  if (status === "pending") {
    tasks = tasks.filter((task) => !task.completed);
  }

  if (status === "completed") {
    tasks = tasks.filter((task) => task.completed);
  }

  if (search) {
    tasks = tasks.filter((task) => {
      const content = `${task.title} ${task.description}`.toLowerCase();
      return content.includes(search);
    });
  }

  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getTask(id) {
  const tasks = await repository.readAll();
  return tasks.find((task) => task.id === id) || null;
}

async function createTask(data) {
  const tasks = await repository.readAll();
  const now = new Date().toISOString();

  const task = {
    id: crypto.randomUUID(),
    title: String(data.title).trim(),
    description: String(data.description || "").trim(),
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  await repository.writeAll(tasks);
  return task;
}

async function updateTask(id, data) {
  const tasks = await repository.readAll();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const current = tasks[index];
  tasks[index] = {
    ...current,
    title: data.title !== undefined ? String(data.title).trim() : current.title,
    description:
      data.description !== undefined
        ? String(data.description).trim()
        : current.description,
    completed:
      data.completed !== undefined ? Boolean(data.completed) : current.completed,
    updatedAt: new Date().toISOString()
  };

  await repository.writeAll(tasks);
  return tasks[index];
}

async function toggleTask(id) {
  const task = await getTask(id);
  if (!task) {
    return null;
  }

  return updateTask(id, { completed: !task.completed });
}

async function deleteTask(id) {
  const tasks = await repository.readAll();
  const filtered = tasks.filter((task) => task.id !== id);

  if (filtered.length === tasks.length) {
    return false;
  }

  await repository.writeAll(filtered);
  return true;
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask
};
