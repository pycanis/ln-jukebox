import { paymentRequestWithSocketIdMap } from "../state";
import { RouteParams } from "../types";

export const registerWebsockets = ({ io }: RouteParams) => {
  io.on("connection", (socket) => {
    const paymentRequest = socket.handshake.query.paymentRequest;

    paymentRequestWithSocketIdMap.set(paymentRequest, socket.id);

    socket.on("disconnect", (reason) => {
      console.log(`${socket.id} disconnected due to: ${reason}`);
    });
  });
};
