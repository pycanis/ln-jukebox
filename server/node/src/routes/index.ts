import { RouteParams } from "../types";
import { getPaymentRoutes } from "./payment";
import { getQueueRoutes } from "./queue";
import { getStreamRoutes } from "./stream";
import { getWebhookRoutes } from "./webhooks";

export const registerRoutes = (params: RouteParams) => {
  getQueueRoutes(params);
  getStreamRoutes(params);
  getPaymentRoutes(params);
  getWebhookRoutes(params);
};
