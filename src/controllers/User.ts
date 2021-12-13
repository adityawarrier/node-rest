import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { AuthService } from "../services/Auth";
import { logger } from "../utils/Logger";
import { ObjectUtils } from "../utils/Object";
import { RegisterUserRequestBody } from "../validators/User";

const register = async (
  req: Request<any, any, RegisterUserRequestBody["body"]>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: await AuthService.hashPassword(password),
    });

    let savedUser = await newUser.save();
    res.status(200).send(ObjectUtils.omit("password", savedUser.toJSON()));
  } catch (err: any) {
    logger.error(err);

    if (err?.code && err?.code === 11000) {
      res.status(409).send({
        status: "Error",
        message: "User Already registered! Proceed to Login!",
      });
      return;
    }

    res.status(400).send({
      status: "Error",
      message: err.message,
    });
  }
};

export const UserController = {
  register,
};
