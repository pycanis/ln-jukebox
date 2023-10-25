import { QueueStatus, prisma } from "../db";
import { WEBHOOK_SECRET } from "../services/env";
import { paymentRequestWithSocketIdMap } from "../state";
import { RouteParams } from "../types";
import { WebsocketEvents } from "../websocketEvents";

export const getWebhookRoutes = ({ app, io }: RouteParams) => {
  app.post("/webhook/payment-success", async (req, res) => {
    const auth = req.headers.authorization;

    if (!auth || auth !== WEBHOOK_SECRET) {
      throw new Error("Not authorized");
    }

    const { paymentRequest } = req.body;

    const queueItem = await prisma.queue.update({
      where: { paymentRequest },
      data: { status: QueueStatus.READY },
    });

    const targetSocketId = paymentRequestWithSocketIdMap.get(paymentRequest);

    if (!targetSocketId) {
      return res.json();
    }

    const targetSocket = io.sockets.sockets.get(targetSocketId);

    if (!targetSocket) {
      return res.json();
    }

    const queuePosition = await prisma.queue.count({
      where: {
        satsAmount: { gte: queueItem.satsAmount },
        status: { equals: QueueStatus.READY },
      },
    });

    const {
      _sum: { durationInSeconds: timeEstimateInSeconds },
    } = await prisma.queue.aggregate({
      _sum: { durationInSeconds: true },
      where: {
        id: { not: queueItem.id },
        satsAmount: { gte: queueItem.satsAmount },
        status: { equals: QueueStatus.READY },
      },
    });

    targetSocket.emit(WebsocketEvents.PAYMENT_SUCCESS, {
      queueItemId: queueItem.id,
      queuePosition,
      timeEstimateInSeconds,
    });

    if (queuePosition <= 10) {
      io.emit(WebsocketEvents.QUEUE_UPDATED);
    }

    paymentRequestWithSocketIdMap.delete(paymentRequest);

    res.json();
  });
};
