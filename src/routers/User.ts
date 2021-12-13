import { Router } from "express";
import { validateSchema } from "../middlewares/ValidateSchema";
import { verifyToken } from "../middlewares/verifyToken";
import { UserController } from "../controllers/User";
import { UserValidators } from "../validators/User";

enum UserRoutes {
  REGISTER = "/register/",
  LOGIN = "/login/",
  LOGOUT = "/logout/",
  SESSIONS = "/sessions/",
}

export const userRouter = Router();

userRouter.post(
  UserRoutes.REGISTER,
  validateSchema(UserValidators.register),
  UserController.register
);

userRouter.post(
  UserRoutes.LOGIN,
  validateSchema(UserValidators.login),
  UserController.login
);

userRouter.get(
  UserRoutes.SESSIONS,
  [validateSchema(UserValidators.sessions), verifyToken],
  UserController.session
);

userRouter.delete(UserRoutes.LOGOUT, verifyToken, UserController.logout);
