import { Server } from "socket.io";
import { QueueStatus, prisma } from "../db";
import { audioPlayer } from "./audioPlayer";
import { getCurrentQueueItem } from "./getCurrentQueueItem";

export const init = async (io: Server) => {
  await prisma.queue.updateMany({
    where: {
      status: QueueStatus.PLAYING,
    },
    data: { status: QueueStatus.READY },
  });

  let currentQueueItem = await getCurrentQueueItem();

  audioPlayer(currentQueueItem, io);
};
