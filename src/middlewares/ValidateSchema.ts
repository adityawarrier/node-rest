import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validate =
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
      res.status(400).send({
        status: "Error",
        message: err.errors,
      });
    }
  };
