import express from "express";
import dotenv from "dotenv";
import { ConfigHelper, ConfigKeys } from "./utils/ConfigHelper";
import { DatabaseService } from "./services/DatabaseService";
import { logger } from "./utils/Logger";

// APP INSTACE
const app = express();

// LOAD ENV VARIABLES
dotenv.config();

// CONNECT TO DB
DatabaseService.connect();

app.listen(ConfigHelper.getItem(ConfigKeys.PORT), () => {
  logger.info(`App running at ${ConfigHelper.getItem(ConfigKeys.PORT)}`);
});
