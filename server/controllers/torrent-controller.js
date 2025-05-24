import { client, downloadsPath } from "../services/torrentService.js";
import {
  emitTorrentDone,
  emitTorrentProgress,
  io,
} from "../services/socketio-service.js";
import { saveMagnetLink, removeMagnetLink } from "../utils/torrent.js";
import {
  torrentDone,
  torrentDownload,
  torrentError,
  torrentReady,
} from "../services/torrent-service.js";

export const getTorrents = (_, res) => {
  try {
    const torrents = client.torrents.map((t) => ({
      name: t.name,
      infoHash: t.infoHash,
      progress: (t.progress * 100).toFixed(2),
      downloaded: t.downloaded,
      total: t.length,
    }));
    res.status(200).json(torrents);
  } catch (error) {
    console.error("error while getting Torrents: ", error.message || error);
  }
};

export const addTorrent = (req, res) => {
  try {
    const { magnetURI } = req.body;
    if (!magnetURI) return res.status(400).json({ message: "No magnet link" });

    saveMagnetLink(magnetURI);
    const torrent = client.add(magnetURI, { path: downloadsPath });

    torrentError(torrent, (err) =>
      console.error("Torrent error:", err.message)
    );
    torrentReady(torrent, () =>
      console.log(`Metadata loaded: ${torrent.name}`)
    );
    torrentDownload(torrent, () => emitTorrentProgress(io, torrent));
    torrentDone(torrent, () => emitTorrentDone(io, torrent));

    res.status(200).json({ message: "Torrent added" });
  } catch (error) {
    console.error("error while adding the torrent: ", error.message || error);
  }
};

export const pauseTorrent = (req, res) => {
  try {
    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    if (torrent) {
      torrent.deselect(0, torrent.pieces.length - 1, false);
      return res.json({ message: "Paused" });
    }
    res.status(404).json({ message: "Torrent not found" });
  } catch (error) {
    console.error("error while pausing the torrent: ", error.message || error);
  }
};

export const resumeTorrent = (req, res) => {
  try {
    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    if (torrent) {
      torrent.select(0, torrent.pieces.length - 1, 0);
      return res.json({ message: "Resumed" });
    }
    res.status(404).json({ message: "Torrent not found" });
  } catch (error) {
    console.error("error while resuming the torrent: ", error.message || error);
  }
};

export const deleteTorrent = (req, res) => {
  try {
    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    if (torrent) {
      torrent.destroy({ destroyStore: true }, (err) => {
        if (err) return res.status(500).json({ message: "Failed to delete" });
        removeMagnetLink(infoHash);
        return res.json({ message: "Deleted" });
      });
    } else {
      res.status(404).json({ message: "Torrent not found" });
    }
  } catch (error) {
    console.error("error while deleting the torrent: ", error.message || error);
  }
};
