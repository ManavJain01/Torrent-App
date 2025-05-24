import WebTorrent from "webtorrent";
import path from "path";
import fs from "fs";

export const downloadsPath = path.resolve("./downloads");
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath);
}

export const client = new WebTorrent();

export const torrentError = (torrent, errorExecution) => {
  torrent.on("error", () => errorExecution());
};

export const torrentReady = (torrent, readyExecution) => {
  torrent.on("ready", () => readyExecution());
};

export const torrentDownload = (torrent, downloadExecution) => {
  torrent.on("download", () => downloadExecution());
};

export const torrentDone = (torrent, doneExecution) => {
  torrent.on("done", () => doneExecution());
};
