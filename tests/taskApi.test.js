const fs = require("fs");
const path = require("path");
const request = require("supertest");
const createApp = require("../src/app");

const testFile = path.join(__dirname, "..", "data", "tasks.test.json");
process.env.TASKS_FILE = testFile;

const app = createApp();

beforeEach(() => {
  fs.mkdirSync(path.dirname(testFile), { recursive: true });
  fs.writeFileSync(testFile, "[]", "utf8");
});

afterAll(() => {
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
});

describe("API de tareas", () => {
  test("GET /api/health devuelve estado correcto", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("POST /api/tasks crea una tarea", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Preparar exposición", description: "Revisar diapositivas" });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Preparar exposición");
    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBeDefined();
  });

  test("POST /api/tasks rechaza título vacío", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "   " });

    expect(response.statusCode).toBe(400);
  });

  test("PATCH /api/tasks/:id/toggle cambia el estado", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Tarea de prueba" });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/toggle`);

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PUT /api/tasks/:id actualiza la tarea", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Nombre inicial" });

    const response = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ title: "Nombre actualizado", description: "Nueva descripción" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Nombre actualizado");
    expect(response.body.description).toBe("Nueva descripción");
  });

  test("DELETE /api/tasks/:id elimina la tarea", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Eliminar" });

    const response = await request(app)
      .delete(`/api/tasks/${created.body.id}`);

    expect(response.statusCode).toBe(204);

    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(0);
  });
});
