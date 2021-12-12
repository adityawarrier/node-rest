enum ConfigKeys {
  PORT = "PORT",
  TOKEN_SECRET = "TOKEN_SECRET",
  DB_CONNECT = "DB_CONNECT",
}

class ConfigHelper {
  public getItem = (key: ConfigKeys): string => {
    return process.env[key] ?? "";
  };
}

const CH = new ConfigHelper();
export { CH as ConfigHelper, ConfigKeys };
