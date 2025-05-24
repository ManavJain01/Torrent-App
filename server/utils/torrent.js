import fs from "fs";
import path from "path";
import parseMagnetURI from "magnet-uri";
import WebTorrent from "webtorrent";
import {
  emitTorrentDone,
  emitTorrentProgress,
} from "../services/socketio-service";
import { torrentDownload } from "../services/torrent-service";

const torrentsFilePath = path.resolve("../torrents.json");
const downloadsPath = path.resolve("./downloads");

export const loadSavedTorrents = async (client, io) => {
  if (fs.existsSync(torrentsFilePath)) {
    const magnetURIs = JSON.parse(fs.readFileSync(torrentsFilePath));
    const MAX_CONCURRENT = 5;
    let current = 0;

    magnetURIs.forEach((uri) => {
      if (current >= MAX_CONCURRENT) return;
      current++;

      try {
        const torrent = client.add(uri, { path: downloadsPath });
        torrentDownload(torrent, () => emitTorrentProgress(io, torrent));
        torrentDone(torrent, () => emitTorrentDone(io, torrent));
      } catch (error) {
        console.error(
          `Failed to add torrent for URI: ${uri}`,
          error.message || error
        );
      }
    });
  }
};

export const saveMagnetLink = (magnetURI) => {
  let torrents = [];
  if (fs.existsSync(torrentsFilePath)) {
    torrents = JSON.parse(fs.readFileSync(torrentsFilePath));
  }
  if (!torrents.includes(magnetURI)) {
    torrents.push(magnetURI);
    fs.writeFileSync(torrentsFilePath, JSON.stringify(torrents, null, 2));
  }
};

export const removeMagnetLink = async (infoHash) => {
  try {
    if (!fs.existsSync(torrentsFilePath)) return;

    const magnetURIs = JSON.parse(fs.readFileSync(torrentsFilePath));

    const filteredURIs = [];
    const client = new WebTorrent();

    for (const uri of magnetURIs) {
      const torrent = await new Promise((resolve) => {
        const t = client.add(uri, { destroyStoreOnDestroy: true }, () =>
          resolve(t)
        );
      });

      const parsed = parseMagnetURI(uri);
      if (parsed.infoHash !== infoHash) {
        filteredURIs.push(uri);
      }

      torrent.destroy();
    }

    client.destroy();
    fs.writeFileSync(torrentsFilePath, JSON.stringify(filteredURIs, null, 2));
  } catch (error) {
    console.error(
      "error while removing magnet links: ",
      error.message || error
    );
  }
};
