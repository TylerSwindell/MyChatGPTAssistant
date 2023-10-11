import Logger from "ts-logger-node";
import { existsSync, mkdirSync } from "fs";

export default function initialize() {
  try {
    if (!existsSync("./sessions/")) mkdirSync("./sessions/");
  } catch (err) {
    Logger.print(err as string, "ERROR");
  }
}
