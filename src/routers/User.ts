import { Router } from "express";
import { UserController } from "../controllers/User";
import { validateSchema } from "../middlewares/ValidateSchema";
import { UserValidators } from "../validators/User";

export const userRouter = Router();

userRouter.post(
  "/register/",
  validateSchema(UserValidators.register),
  UserController.register
);
