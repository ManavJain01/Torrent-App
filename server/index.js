// backend/index.js
import express from "express";
import http from "http";
import cors from "cors";
import fs from "fs";
import path from "path";

// Importing local files
import { initSocket } from "./services/socketio-service.js";
import { loadSavedTorrents } from "./utils/torrent.js";

// Importing Routes
import routes from "./routes/route.js";

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const PORT = 5000;

// Ensure torrents file exists
const torrentsFilePath = path.resolve("./torrents.json");
if (!fs.existsSync(torrentsFilePath)) {
  fs.writeFileSync(torrentsFilePath, JSON.stringify({}));
}

app.use(
  cors({
    origin: ["*"],
    methods: ["POST", "GET", "PATCH", "PUT"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/", routes);

loadSavedTorrents(client, io).then(() =>
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
);
