import { Request, Response, NextFunction } from "express";
import { AppError, HttpStatusCode } from "../services/AppError";

export const RouteNotFound = (req: Request, _: Response, next: NextFunction): void => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatusCode.NOT_FOUND));
};
