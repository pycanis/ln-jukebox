import ytdl from "ytdl-core";
import { QueueStatus, prisma } from "../db";
import { currentSecond } from "../services/audioPlayer";
import { validateLink, validateLinkLength } from "../services/linkValidations";
import { RouteParams } from "../types";

export const getQueueRoutes = ({ app }: RouteParams) => {
  app.get("/", async (_req, res) => {
    const currentItem = await prisma.queue.findFirst({
      where: {
        status: QueueStatus.PLAYING,
      },
    });

    return res.json(
      currentItem
        ? {
            id: currentItem.id,
            name: currentItem.name,
            durationInSeconds: currentItem.durationInSeconds,
            currentSecond,
          }
        : null
    );
  });

  app.get("/queue", async (req, res) => {
    const queueItems = await prisma.queue.findMany({
      where: {
        status: QueueStatus.READY,
      },
      orderBy: [
        { satsAmount: "desc" },
        {
          createdAt: "asc",
        },
      ],
      take: 10,
    });

    res.json(
      queueItems.map((item) => ({
        id: item.id,
        durationInSeconds: item.durationInSeconds,
        name: item.name,
        satsAmount: item.satsAmount,
      }))
    );
  });

  app.post("/validate-link", async (req, res) => {
    const link = req.body.link;

    validateLink(link);

    const info = await ytdl.getBasicInfo(link);

    const durationInSeconds = +info.videoDetails.lengthSeconds;

    validateLinkLength(durationInSeconds);

    return res.json();
  });
};
