enum ConfigKeys {
  PORT = "PORT",
  TOKEN_SECRET = "TOKEN_SECRET",
  DB_CONNECT = "DB_CONNECT",
  SALT_WORK_FACTOR = "SALT_WORK_FACTOR",
  ACCESS_TOKEN_TTL = "ACCESS_TOKEN_TTL",
  REFRESH_TOKEN_TTL = "REFRESH_TOKEN_TTL",
}

class ConfigHelper {
  public getItem = (key: ConfigKeys): string => {
    return process.env[key] ?? "";
  };
}

const CH = new ConfigHelper();
export { CH as ConfigHelper, ConfigKeys };
