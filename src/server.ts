import express from "express";
import dotenv from 'dotenv';
import { ConfigHelper, ConfigKeys } from "./utils/ConfigHelper";

// APP INSTACE
const app = express();

// LOAD ENV VARIABLES
dotenv.config();

app.listen(ConfigHelper.getItem(ConfigKeys.PORT), () => {
  console.log('App running!')
})