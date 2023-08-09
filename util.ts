export { config as loadEnv } from "dotenv";
import { Dateable, TimestampIntoDate } from "./classes.js";

export function checkEnvReady(requiredVars: string[]) {
  for (let v of requiredVars) {
    if (typeof process.env[v] !== "string") {
      throw new Error(`Check your .env file... "${v}" is missing.`);
    } else {
      console.log(`Env ${v} loaded...`);
    }
  }
}

export function dateify<T extends Dateable>(obj: T): TimestampIntoDate<T> {
  return {
    ...obj,
    date: new Date(obj.date * 1000),
  };
}
