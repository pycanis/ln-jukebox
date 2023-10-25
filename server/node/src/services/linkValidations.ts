import ytdl from "ytdl-core";
import { VIDEO_MAX_LENGTH_IN_SECONDS } from "../constants";

export const validateLinkLength = (durationInSeconds: number) => {
  if (durationInSeconds < 10) {
    throw new Error("Too short!");
  }

  if (durationInSeconds > VIDEO_MAX_LENGTH_IN_SECONDS) {
    throw new Error("Too long!");
  }
};

export const validateLink = (link: unknown) => {
  if (!link || typeof link !== "string" || !ytdl.validateURL(link)) {
    throw new Error("Invalid link!");
  }
};

export const validateLinkAndPaymentAmount = (
  link: unknown,
  satsAmount: unknown
) => {
  validateLink(link);

  if (typeof satsAmount !== "number" || satsAmount < 1) {
    throw new Error("Invalid amount!");
  }
};
