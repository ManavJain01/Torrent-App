// Accessing Express Packages
import express from "express";
const router = express.Router();

// Importing Routes
import TorrentRoutes from "./torrent-routes";

router.get("/ping", (req, res) => res.send("pong"));
router.use("/torrent", TorrentRoutes);

// Exporting router
export default router;
