import { Server } from "socket.io";
import throttle from "lodash.throttle";

export let io = null; // Export socket object to use in controller

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  return io;
};

export const emitTorrentProgress = throttle((io, torrent) => {
  console.log(torrent.name, " is in progress...");

  io.emit("progress", {
    name: torrent.name,
    progress: (torrent.progress * 100).toFixed(2),
    downloaded: torrent.downloaded,
    total: torrent.length,
  });
}, 1000);

export const emitTorrentDone = (io, torrent) => {
  console.log(torrent.name, " is completed.");

  io.emit("done", { name: torrent.name });
};
