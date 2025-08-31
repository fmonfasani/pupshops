// server/app.ts
import express from "express";
import cors from "cors";

export const app = express();
app.disable("x-powered-by");

// CORS: en Vercel servís front y API en el mismo dominio,
// pero dejamos credentials por si usás dominio separado.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inicializador perezoso para registrar rutas 1 sola vez
let initialized = false;
export async function setupApp() {
  if (initialized) return;
  const { registerRoutes } = await import("./routes");
  await registerRoutes(app);
  initialized = true;
}
