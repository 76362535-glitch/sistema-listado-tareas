const API_URL = "/api/tasks";

const taskForm = document.querySelector("#taskForm");
const taskId = document.querySelector("#taskId");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const submitButton = document.querySelector("#submitButton");
const cancelButton = document.querySelector("#cancelButton");
const searchInput = document.querySelector("#searchInput");
const taskList = document.querySelector("#taskList");
const taskTemplate = document.querySelector("#taskTemplate");
const message = document.querySelector("#message");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let activeFilter = "all";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error inesperado." }));
    throw new Error(error.message || "Error inesperado.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadTasks() {
  try {
    const params = new URLSearchParams();
    if (activeFilter !== "all") params.set("status", activeFilter);
    if (searchInput.value.trim()) params.set("search", searchInput.value.trim());

    tasks = await request(`${API_URL}?${params.toString()}`);
    renderTasks();
    updateStats();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  if (!tasks.length) {
    taskList.innerHTML = '<div class="empty">No se encontraron tareas para mostrar.</div>';
    return;
  }

  for (const task of tasks) {
    const fragment = taskTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".task-card");
    const checkButton = fragment.querySelector(".check-button");
    const editButton = fragment.querySelector(".edit-button");
    const deleteButton = fragment.querySelector(".delete-button");

    card.classList.toggle("completed", task.completed);
    fragment.querySelector("h2").textContent = task.title;
    fragment.querySelector("p").textContent = task.description || "Sin descripción";
    fragment.querySelector("small").textContent =
      `Actualizada: ${new Date(task.updatedAt).toLocaleString("es-PE")}`;

    checkButton.addEventListener("click", () => toggleTask(task.id));
    editButton.addEventListener("click", () => startEdit(task));
    deleteButton.addEventListener("click", () => removeTask(task.id));

    taskList.appendChild(fragment);
  }
}

async function updateStats() {
  try {
    const all = await request(API_URL);
    document.querySelector("#totalCount").textContent = all.length;
    document.querySelector("#pendingCount").textContent =
      all.filter((task) => !task.completed).length;
    document.querySelector("#completedCount").textContent =
      all.filter((task) => task.completed).length;
  } catch {
    // La lista principal seguirá disponible aunque fallen las estadísticas.
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim()
  };

  try {
    if (taskId.value) {
      await request(`${API_URL}/${taskId.value}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showMessage("Tarea actualizada correctamente.");
    } else {
      await request(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showMessage("Tarea agregada correctamente.");
    }

    resetForm();
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
});

function startEdit(task) {
  taskId.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  submitButton.textContent = "Guardar cambios";
  cancelButton.classList.remove("hidden");
  titleInput.focus();
}

function resetForm() {
  taskForm.reset();
  taskId.value = "";
  submitButton.textContent = "Agregar tarea";
  cancelButton.classList.add("hidden");
}

cancelButton.addEventListener("click", resetForm);

async function toggleTask(id) {
  try {
    await request(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function removeTask(id) {
  const confirmed = window.confirm("¿Deseas eliminar esta tarea?");
  if (!confirmed) return;

  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    showMessage("Tarea eliminada.");
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    loadTasks();
  });
});

let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadTasks, 250);
});

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.classList.remove("hidden");

  window.setTimeout(() => {
    message.classList.add("hidden");
  }, 3000);
}

loadTasks();
