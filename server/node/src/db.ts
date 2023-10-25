import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export enum QueueStatus {
  UNPAID = "UNPAID",
  READY = "READY",
  PLAYING = "PLAYING",
  PLAYED = "PLAYED",
}
