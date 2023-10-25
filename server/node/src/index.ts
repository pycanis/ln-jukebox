import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { registerRoutes } from "./routes";
import { FE_ORIGIN, PORT } from "./services/env";
import { init } from "./services/init";
import { registerWebsockets } from "./websockets";

const main = async () => {
  const app = express();

  const server = http.createServer(app);

  const io = new Server(server, {
    transports: ["websocket"],
    cors: { origin: FE_ORIGIN },
  });

  app.use(express.json());
  app.use(cors({ origin: FE_ORIGIN }));

  await init(io);

  registerRoutes({ app, io });
  registerWebsockets({ app, io });

  app.use(errorMiddleware);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main();
