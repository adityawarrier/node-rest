import { NextFunction, Request, Response } from "express";

type Func = (req: Request, res: Response, next: NextFunction) => void;
type AsyncFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (fn: AsyncFunc): Func => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
