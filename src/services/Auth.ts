import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { logger } from "../utils/Logger";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";
import { SessionModel } from "../models/Session";
import { UserModel } from "../models/User";

export interface IToken {
  id: Schema.Types.ObjectId;
  name: string;
  session: string;
}

class AuthService {
  public hashPassword = async (password: string): Promise<string> => {
    const workFactor = ConfigHelper.getItem(ConfigKeys.SALT_WORK_FACTOR);

    const salt = await bcrypt.genSalt(parseInt(workFactor, 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  };

  public validatePassword = (
    resPassword: string,
    modelPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(resPassword, modelPassword);
  };

  public createToken = (data: IToken, options?: jwt.SignOptions): string => {
    return jwt.sign(
      data,
      ConfigHelper.getItem(ConfigKeys.TOKEN_SECRET),
      options
    );
  };

  public verifyToken = (
    token: string
  ): {
    valid: boolean;
    expired: boolean;
    token: IToken | null;
  } => {
    try {
      const decoded = jwt.verify(
        token,
        ConfigHelper.getItem(ConfigKeys.TOKEN_SECRET)
      ) as jwt.JwtPayload as IToken;
      return {
        valid: true,
        expired: false,
        token: decoded,
      };
    } catch (e: any) {
      logger.error(e.message);

      return {
        valid: false,
        expired: e.message === "jwt expired",
        token: null,
      };
    }
  };

  public reIssueToken = async (
    refreshToken: string
  ): Promise<string | null> => {
    const { token: decoded } = this.verifyToken(refreshToken);
    if (!decoded) {
      return null;
    }

    const session = await SessionModel.findById(decoded.session);
    if (!session || !session.valid) {
      return null;
    }

    const user = await UserModel.findById(decoded.id).lean();
    if (!user) {
      return null;
    }

    const newAccessToken = this.createToken(
      {
        id: user._id,
        name: user.name,
        session: session._id,
      },
      { expiresIn: ConfigHelper.getItem(ConfigKeys.ACCESS_TOKEN_TTL) }
    );

    return newAccessToken;
  };
}

const AS = new AuthService();
export { AS as AuthService };
