import { Express } from "express";
import { userRouter } from "./User";

export const RootRouter = {
  registerRoutes: (app: Express): void => {
    app.use('/api/user/', userRouter);
  },
};