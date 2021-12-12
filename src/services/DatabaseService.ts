import mongoose from "mongoose";
import { ConfigHelper, ConfigKeys } from "../utils/ConfigHelper";
import { logger } from "../utils/Logger";

class DatabaseService {
  public connect = async (): Promise<void> => {
    try {
      mongoose.connect(ConfigHelper.getItem(ConfigKeys.DB_CONNECT));
      logger.info("DB connection established!");
    } catch (error) {
      logger.error("Error connecting to DB", error);
      process.exit(1);
    }
  };
}

const DH = new DatabaseService();
export { DH as DatabaseService };
