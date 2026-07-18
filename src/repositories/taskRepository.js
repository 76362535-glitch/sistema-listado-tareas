const fs = require("fs/promises");
const path = require("path");

function getDataFile() {
  return process.env.TASKS_FILE
    ? path.resolve(process.env.TASKS_FILE)
    : path.join(__dirname, "..", "..", "data", "tasks.json");
}

async function ensureFile() {
  const file = getDataFile();
  await fs.mkdir(path.dirname(file), { recursive: true });

  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

async function readAll() {
  await ensureFile();
  const content = await fs.readFile(getDataFile(), "utf8");

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(tasks) {
  await ensureFile();
  await fs.writeFile(getDataFile(), JSON.stringify(tasks, null, 2), "utf8");
}

module.exports = {
  readAll,
  writeAll
};
