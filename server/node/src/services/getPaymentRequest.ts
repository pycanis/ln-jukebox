import axios from "axios";
import { LN_API } from "./env";

export const getPaymentRequest = async (amount: number, description: string) =>
  (
    await axios.get(
      `${LN_API}?amount=${amount * 1000}&description=${description}`
    )
  ).data.pr;
