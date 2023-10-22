import { randomUUID } from "crypto";
import fs from "fs";
import Logger from "ts-logger-node";
import { SessionLog } from "./@types";
import Session from "./Session.class";

const { writeFileSync } = fs;

export const defaultChatLog = (): SessionLog => {
  const startDate = Date.now();
  return {
    title: "session",
    startDate,
    id: randomUUID(),
    fileName: "session-" + startDate.toString(),
    messages: [
      {
        role: "assistant",
        content: "\nHello!\nWhat is your name and how can I help you?",
      },
    ],
  };
};

export const generateSession = (options?: SessionLog) =>
  new Session(options === undefined ? defaultChatLog() : options);

export const loadSession = (options: SessionLog): Session =>
  new Session(options);

export const isSessionLoaded = (session: Session | undefined): boolean =>
  session !== undefined ? true : false;

export const createSession = (): Session => new Session(defaultChatLog());

export const saveSession = (session?: Session): boolean => {
  let successfulSave = true;
  try {
    if (session === undefined)
      throw new Error("ERROR SAVING SESSION: No session is currently loaded.");

    writeFileSync(
      `${session.getSaveFolder()}${session.getFileName()}.json`,
      JSON.stringify(session.getLog())
    );
    if (
      !fs
        .readdirSync(session.getSaveFolder())
        .includes(`${session.getFileName()}.json`)
    ) {
      successfulSave = false;
      throw Error("Error writing session data to json.");
    }
  } catch (err) {
    Logger.print(err as string, "ERROR");
  }

  return successfulSave;
};

export const deleteSession = (session: Session): boolean => {
  let successfulDelete = true;
  try {
    fs.rmSync(`${session.getSaveFolder()}${session.getFileName()}.json`);
    if (
      fs
        .readdirSync(session.getSaveFolder())
        .includes(`${session.getFileName()}.json`)
    )
      throw Error("Error deleting session data.");
  } catch (err) {
    successfulDelete = false;
    Logger.print(err as string, "ERROR");
  }
  return successfulDelete;
};
