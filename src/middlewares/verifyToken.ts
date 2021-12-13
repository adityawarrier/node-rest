import { NextFunction, Request, Response } from "express";
import { AuthService, IToken } from "../services/Auth";
import { logger } from "../utils/Logger";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  token = token?.split(" ")[1] ?? "";

  if (!token) {
    return res.status(401).send({
      status: "Error",
      message: "Access Denied",
    });
  }

  try {
    const { token: tokenPayload } = AuthService.verifyToken(token);
    if (!tokenPayload) {
      throw new Error();
    }

    // Save user details temporarily in the res object
    res.locals.meta = {
      ...tokenPayload,
    };

    next();
  } catch (err: any) {
    logger.error(err);
    return res.status(401).send({
      status: "Error",
      message: "Access Denied",
    });
  }
};

export { verifyToken };
