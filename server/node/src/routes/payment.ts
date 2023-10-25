import { createId } from "@paralleldrive/cuid2";
import ytdl from "ytdl-core";
import { QueueStatus, prisma } from "../db";
import { getPaymentRequest } from "../services/getPaymentRequest";
import {
  validateLinkAndPaymentAmount,
  validateLinkLength,
} from "../services/linkValidations";
import { RouteParams } from "../types";

export const getPaymentRoutes = ({ app }: RouteParams) => {
  app.post("/payment-request", async (req, res) => {
    const { link, satsAmount } = req.body;

    validateLinkAndPaymentAmount(link, satsAmount);

    const info = await ytdl.getBasicInfo(link);

    const durationInSeconds = +info.videoDetails.lengthSeconds;

    validateLinkLength(durationInSeconds);

    const paymentRequest = await getPaymentRequest(
      satsAmount,
      `LN Jukebox - ${info.videoDetails.title}`
    );

    if (!paymentRequest) {
      throw new Error("Failed to generate payment request");
    }

    const queueItem = await prisma.queue.create({
      data: {
        id: createId(),
        name: info.videoDetails.title,
        durationInSeconds,
        link,
        satsAmount,
        paymentRequest,
        status: QueueStatus.UNPAID,
      },
    });

    return res.json({
      queueItemId: queueItem.id,
      paymentRequest,
    });
  });
};
