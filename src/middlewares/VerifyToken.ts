import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/Auth";
import { logger } from "../utils/Logger";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  token = token?.split(" ")[1] ?? "";
  const refreshToken = req.headers["x-refresh"];

  if (!token) {
    return res.status(401).send({
      status: "Error",
      message: "Access Denied",
    });
  }

  const { token: tokenPayload, expired } = AuthService.verifyToken(token);

  // If a valid token exists continue normally
  if (tokenPayload) {
    res.locals.meta = {
      ...tokenPayload,
    };
    return next();
  }

  // If token has expired and a valid refresh token exists
  if (expired && refreshToken) {
    const newToken = await AuthService.reIssueToken(refreshToken as string);

    if (!newToken) {
      logger.error("TOKEN ERRORS");

      return res.status(401).send({
        status: "Error",
        message: "Access Denied",
      });
    }

    res.setHeader("x-access-token", newToken);
    const { token: decoded } = AuthService.verifyToken(newToken);

    res.locals.meta = {
      ...decoded,
    };
    return next();
  }

  // If token & refresh token are unavailable
  logger.error("TOKEN ERRORS");

  return res.status(401).send({
    status: "Error",
    message: "Access Denied",
  });
};

export { verifyToken };
