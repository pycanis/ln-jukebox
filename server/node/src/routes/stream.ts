import { spawn } from "child_process";
import { CURRENT_SONG_PATH } from "../constants";
import { currentSecond } from "../services/audioPlayer";
import { RouteParams } from "../types";

export const getStreamRoutes = ({ app }: RouteParams) => {
  app.get("/stream", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
    });

    const ffmpegProcess = spawn("ffmpeg", [
      "-ss",
      currentSecond.toString(),
      "-i",
      CURRENT_SONG_PATH,
      "-f",
      "mp3",
      "pipe:1",
    ]);

    ffmpegProcess.stdout.pipe(res);

    ffmpegProcess.on("error", (err) => {
      console.error("FFmpeg error: " + err);
    });

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("FFmpeg process exited with code " + code);
      }
    });

    req.on("close", () => {
      // If the client disconnects, kill the FFmpeg process
      ffmpegProcess.kill();
    });
  });
};
