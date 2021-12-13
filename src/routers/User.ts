import { Router } from "express";
import { validateSchema } from "../middlewares/ValidateSchema";
import { verifyToken } from "../middlewares/verifyToken";
import { UserController } from "../controllers/User";
import { UserValidators } from "../validators/User";

export const userRouter = Router();

userRouter.post(
  "/register/",
  validateSchema(UserValidators.register),
  UserController.register
);

userRouter.post(
  "/login/",
  validateSchema(UserValidators.login),
  UserController.login
);

userRouter.get(
  "/sessions/",
  [validateSchema(UserValidators.sessions), verifyToken],
  UserController.session
);
