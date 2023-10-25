import fs from "fs";
import { CURRENT_SONG_PATH } from "../constants";
import { RouteParams } from "../types";

export const getStreamRoutes = ({ app }: RouteParams) => {
  app.get("/stream", (_req, res) => {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
    });

    const audioReadable = fs.createReadStream(CURRENT_SONG_PATH);

    audioReadable.pipe(res);
  });
};
