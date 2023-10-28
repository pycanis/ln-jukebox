// @ts-ignore
import youtubesearchapi from "youtube-search-api";
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

  // youtube api allows only 100 searches per day... unusable
  // app.get("/search", async (req, res) => {
  //   const q = req.query.q;

  //   if (!q) {
  //     throw new Error("Specify search query");
  //   }
  //   const { data } = await youtube.search.list({
  //     part: ["snippet"],
  //     type: ["video"],
  //     q: q as string,
  //     key: YOUTUBE_API_KEY,
  //   });

  //   const items = data.items?.map((item) => ({
  //     videoId: item.id?.videoId,
  //     title: item.snippet?.title,
  //   }));

  //   res.json(items);
  // });

  app.get("/search", async (req, res) => {
    const q = req.query.q;

    if (!q) {
      throw new Error("Specify search query");
    }

    const data = await youtubesearchapi
      .GetListByKeyword(q, false, 5, [{ type: "video" }])
      .catch((e: unknown) => {
        console.error(e);
      });

    res.json(
      data.items.map((item: { id: string; title: string }) => ({
        videoId: item.id,
        title: item.title,
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
