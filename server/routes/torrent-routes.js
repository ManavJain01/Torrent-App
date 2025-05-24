import { Router } from "express";
import {
  getTorrents,
  addTorrent,
  pauseTorrent,
  resumeTorrent,
  deleteTorrent,
} from "../controllers/torrentController.js";

const router = Router();

router.get("/", getTorrents);
router.post("/", addTorrent);
router.post("/pause", pauseTorrent);
router.post("/resume", resumeTorrent);
router.post("/delete", deleteTorrent);

export default router;
