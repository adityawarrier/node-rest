import mongoose, { CallbackError } from "mongoose";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";
import { logger } from "../utils/Logger";

class DatabaseService {
  public connect = (): void => {
    mongoose.connect(
      ConfigHelper.getItem(ConfigKeys.DB_CONNECT),
      (error: CallbackError) => {
        if (error) {
          logger.error("Error connecting to DB", error);
          process.exit(1);
        }

        logger.info("DB connection established!");
      }
    );
  };
}

const DH = new DatabaseService();
export { DH as DatabaseService };