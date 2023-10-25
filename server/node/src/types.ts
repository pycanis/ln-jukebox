import { Application } from "express";
import { Server } from "socket.io";

export type RouteParams = {
  app: Application;
  io: Server;
};
