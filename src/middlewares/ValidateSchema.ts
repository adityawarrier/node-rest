import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodIssue } from "zod";
import { logger } from "../utils/Logger";

const extractErrors = (
  error: ZodError
): {
  key: (string | number);
  message: string;
}[] => {
  const errorList = error.errors.map((e: ZodIssue) => ({
    key: e.path[0],
    message: e.message,
  }));

  logger.error(errorList);

  return errorList;
};

export const validateSchema =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, params, body } = req;
      schema.parse({
        body,
        query,
        params,
      });
      next();
    } catch (err: any) {
      res.status(400).send({
        status: "Error",
        message: extractErrors(err),
      });
    }
  };
