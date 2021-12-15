import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodIssue } from "zod";
import { AppError, HttpStatusCode } from "../services/AppError";
import { logger } from "../utils/Logger";

const extractErrors = (
  error: ZodError
): {
  key: string | number;
  message: string;
}[] => {
  const errorList = error.errors.map((e: ZodIssue) => ({
    key: e.path.join(" >> "),
    message: e.message,
  }));

  logger.error(errorList);

  return errorList;
};

export const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, params, body } = req;
      schema.parse({
        body,
        query,
        params,
      });
      next();
    } catch (err: any) {
      next(new AppError(extractErrors(err), HttpStatusCode.BAD_REQUEST));
    }
  };
