import { Queue } from "@prisma/client";
import fs from "fs";
import { Server } from "socket.io";
import ytdl from "ytdl-core";
import { CURRENT_SONG_PATH } from "../constants";
import { QueueStatus, prisma } from "../db";
import { WebsocketEvents } from "../websocketEvents";
import { getCurrentQueueItem } from "./getCurrentQueueItem";

export let currentSecond = 0;

export const audioPlayer = async (
  currentQueueItem: Queue | undefined,
  io: Server
) => {
  if (!currentQueueItem) {
    console.log("Nothing to play, retry in a minute..");

    setTimeout(async () => {
      audioPlayer(await getCurrentQueueItem(), io);
    }, 10000); // 10 seconds

    return;
  }

  console.log(`Playing: ${currentQueueItem.name}`);

  await prisma.queue.update({
    where: { id: currentQueueItem.id },
    data: { status: QueueStatus.PLAYING },
  });

  const audioReadable = ytdl(currentQueueItem.link, {
    filter: "audio",
    quality: "lowestaudio",
  });

  audioReadable
    .pipe(fs.createWriteStream(CURRENT_SONG_PATH))
    .on("finish", () => {
      io.emit(WebsocketEvents.AUDIO_READY);
    });

  const timeout = setInterval(async () => {
    currentSecond++;

    if (currentSecond === currentQueueItem.durationInSeconds) {
      clearInterval(timeout);

      currentSecond = 0;

      await prisma.queue.update({
        where: { id: currentQueueItem.id },
        data: { status: QueueStatus.PLAYED },
      });

      audioPlayer(await getCurrentQueueItem(), io);
    }
  }, 1000);
};
