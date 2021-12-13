import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";

interface IToken {
  id: string;
  name: string;
}

class AuthService {
  public hashPassword = async (password: string): Promise<string> => {
    const workFactor = ConfigHelper.getItem(ConfigKeys.SALT_WORK_FACTOR);

    const salt = await bcryptjs.genSalt(parseInt(workFactor, 10));
    const hashedPassword = await bcryptjs.hash(password, salt);

    return hashedPassword;
  };

  public validatePassword = (
    resPassword: string,
    modelPassword: string
  ): Promise<boolean> => {
    return bcryptjs.compare(resPassword, modelPassword);
  };

  // public createToken = (data: IToken): string => {
  //   return jwt.sign(data, config().token.secret);
  // };

  // public verifyToken = (token: string): IToken => {
  //   return jwt.verify(token, config().token.secret) as IToken;
  // };
}

const AS = new AuthService();
export { AS as AuthService, IToken };
