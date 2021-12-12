import express from "express";
import dotenv from "dotenv";
import { ConfigHelper, ConfigKeys } from "./utils/ConfigHelper";
import { logger } from "./utils/Logger";
import { DatabaseService } from "./services/DatabaseService";
import { RootRouter } from "./routers/RootRouter";

// APP INSTACE
const app = express();

// LOAD ENV VARIABLES
dotenv.config();

app.listen(ConfigHelper.getItem(ConfigKeys.PORT), async () => {
  logger.info(`App running at ${ConfigHelper.getItem(ConfigKeys.PORT)}`);

  // CONNECT TO DB
  await DatabaseService.connect();

  // REGISTER ROUTERS
  RootRouter.registerRoutes(app);
});
