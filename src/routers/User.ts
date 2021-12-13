import { Router } from "express";
import { UserController } from "../controllers/User";

export const userRouter = Router();

userRouter.post('/register/', UserController.register);
