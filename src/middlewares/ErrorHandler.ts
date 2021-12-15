import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/Logger";
import { AppError } from "../services/AppError";

const sendErrorDev = (error: AppError, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
    return;
  }

  // Programming or other unknown error

  // 1) Log error
  logger.error("ERROR 💥: ", error);

  // 2) Send generic message
  res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export const ErrorHandler = (
  error: AppError,
  __: Request,
  res: Response,
  _: NextFunction
): void => {
  error.statusCode = error?.statusCode ?? 500;
  error.status = error?.status ?? "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
};
