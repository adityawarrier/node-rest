import { NextFunction, Request, Response } from "express";
import { AuthService, IToken } from "../services/Auth";
import { logger } from "../utils/Logger";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";
import { ObjectUtils } from "../utils/Object";
import { LoginRequestBody, RegisterUserRequestBody } from "../validators/User";
import { SessionModel } from "../models/Session";
import { UserModel } from "../models/User";
import { AppError, HttpStatusCode } from "../services/AppError";

const register = async (
  req: Request<any, any, RegisterUserRequestBody["body"]>,
  res: Response,
  next: NextFunction
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
      next(
        new AppError(
          "User Already registered! Proceed to Login!",
          HttpStatusCode.CONFLICT
        )
      );
      return;
    }

    next(new AppError(err.message, HttpStatusCode.BAD_REQUEST));
  }
};

const login = async (
  req: Request<any, any, LoginRequestBody["body"]>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  // IF USER DOES NOT EXIST IN THE DB
  if (!user) {
    res.status(404).send({
      status: "Error",
      message: `Email address ${email} does not exist! Please register!`,
    });

    return;
  }

  // VALIDATE PASSWORD
  const isPasswordValid = await AuthService.validatePassword(
    password,
    user.password
  );
  if (!isPasswordValid) {
    res.status(400).send({
      status: "Error",
      message: "Incorrect Password!",
    });

    return;
  }

  try {
    // CREATE SESSION
    const session = await SessionModel.create({
      user: user._id,
      userAgent: req.get("user-agent"),
    });

    // CREATE TOKENS
    const accessToken = AuthService.createToken(
      {
        id: user._id,
        name: user.name,
        session: session._id,
      },
      { expiresIn: ConfigHelper.getItem(ConfigKeys.ACCESS_TOKEN_TTL) }
    );
    const refreshToken = AuthService.createToken(
      {
        id: user._id,
        name: user.name,
        session: session._id,
      },
      { expiresIn: ConfigHelper.getItem(ConfigKeys.REFRESH_TOKEN_TTL) }
    );

    res.status(200).send({ accessToken, refreshToken });
  } catch (e: any) {
    logger.error(e);

    res.status(400).send({
      status: "Error",
      message: "Error Loggin in",
    });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const { session } = res.locals.meta as IToken;

  try {
    await SessionModel.updateOne({ _id: session }, { valid: false });

    res.status(200).send({ accessToken: null, refreshToken: null });
  } catch (e) {
    logger.error(e);

    res.status(400).send({
      status: "Error",
      message: "Error Loggin out",
    });
  }
};

const session = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = res.locals.meta as IToken;

  try {
    const sessionList = await SessionModel.find({
      user: userId,
      valid: true,
    }).lean();
    res.status(200).send({ sessionList });
  } catch (e) {
    logger.error(e);

    res.status(400).send({
      status: "Error",
      message: "Error fetching list of sessions",
    });
  }
};

export const UserController = {
  register,
  login,
  logout,
  session,
};
