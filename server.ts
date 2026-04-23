import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // MoreSpace API Proxy Endpoint
  app.post("/api/license/generate", async (req, res) => {
    const { prefix, durationDays } = req.body;

    if (!prefix || !durationDays) {
      return res.status(400).json({ error: "Eksik parametre: prefix veya durationDays" });
    }

    const apiUrl = process.env.MORESPACE_API_URL;
    const secret = process.env.MORESPACE_SECRET;

    if (!apiUrl || !secret) {
      return res.status(500).json({ error: "Sunucu yapılandırması hatalı (API URL veya Secret bulunamadı)" });
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          durationDays,
          prefix,
        }),
      });

      if (response.status === 401) {
        return res.status(401).json({ error: "Bağlantı şifresi hatalı" });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("MoreSpace API Error:", error);
      return res.status(503).json({ error: "Ana servis şu an kapalı, lütfen daha sonra deneyin" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
