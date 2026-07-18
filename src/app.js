const express = require("express");
const cors = require("cors");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      application: "Sistema de Listado de Tareas",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/tasks", taskRoutes);
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "Recurso no encontrado." });
    }

    return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
  });

  return app;
}

module.exports = createApp;
