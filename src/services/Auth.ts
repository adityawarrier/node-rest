import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";
import { logger } from "../utils/Logger";

export interface IToken {
  id: string;
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
}

const AS = new AuthService();
export { AS as AuthService };
