import { NextFunction, Request, Response } from "express";
import { AppError } from "../services/AppError";

export const ErrorHandler = (
  error: AppError,
  __: Request,
  res: Response,
  _: NextFunction
): void => {
  res.status(error?.statusCode ?? 500).json({
    status: error?.status ?? "Error",
    message: error?.message ?? "",
  });
};
