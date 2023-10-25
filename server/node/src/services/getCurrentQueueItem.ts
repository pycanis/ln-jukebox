import { Queue } from "@prisma/client";
import { QueueStatus, prisma } from "../db";

export const getCurrentQueueItem = async (): Promise<Queue | undefined> =>
  (
    await prisma.queue.findMany({
      where: {
        status: QueueStatus.READY,
      },
      orderBy: {
        satsAmount: "desc",
      },
      take: 1,
    })
  )[0];
