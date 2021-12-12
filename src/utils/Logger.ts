import Logger from "pino";

const logger = Logger({
  prettyPrint: true,
  base: undefined,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
});

export { logger };
