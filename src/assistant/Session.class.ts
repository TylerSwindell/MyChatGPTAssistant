import { ChatCompletionMessage } from "openai/resources";
import { ChatRoles, ChatLog } from "./@types";
import { POST } from "../gpt/post";
import sessionConfig from "./config";
import { UUID, randomUUID } from "crypto";
import fs from "fs";
import Logger from "ts-logger-node";

const { writeFileSync } = fs;

const defaultChatLog = (): ChatLog => {
  const startDate = Date.now();
  return {
    title: sessionConfig.title,
    startDate,
    id: randomUUID(),
    fileName: sessionConfig.title + "-" + startDate.toString(),
    messages: sessionConfig.initial,
  };
};

export const generateSession = (options?: ChatLog): Session =>
  new Session(options === undefined ? defaultChatLog() : options);

export const saveSession = (session: Session): boolean => {
  let successfulSave = true;
  try {
    writeFileSync(
      `${sessionConfig.saveFolder}${session.getFileName()}.json`,
      JSON.stringify(session.getLog())
    );
    if (
      !fs
        .readdirSync(sessionConfig.saveFolder)
        .includes(`${session.getFileName()}.json`)
    ) {
      successfulSave = false;
      throw Error("Error writing session data to json.");
    }
  } catch (err) {
    console.error(err);
  }

  return successfulSave;
};

export const deleteSession = (session: Session): boolean => {
  let successfulDelete = true;
  try {
    fs.rmSync(`${sessionConfig.saveFolder}${session.getFileName()}.json`);
    if (
      fs
        .readdirSync(sessionConfig.saveFolder)
        .includes(`${session.getFileName()}.json`)
    )
      throw Error("Error deleting session data.");
  } catch (err) {
    successfulDelete = false;
    Logger.print(err as string, "ERROR");
  }
  return successfulDelete;
};

export default class Session {
  private sessionLog: ChatLog;
  constructor(session?: ChatLog | undefined) {
    this.sessionLog = session === undefined ? defaultChatLog() : session;
  }

  async ask(
    question: string,
    options: { print?: boolean; role?: ChatRoles }
  ): Promise<ChatCompletionMessage> {
    if (this.sessionLog.messages === undefined) this.sessionLog.messages = [];

    this.sessionLog.messages.push({
      role: options?.role ?? "user",
      content: question,
    });
    const postRes = await POST(this.sessionLog.messages);
    this.sessionLog.messages.push(postRes);

    return postRes;
  }

  chatLength = () => this.sessionLog.messages.length;

  getLog(): ChatLog {
    return this.sessionLog;
  }

  getMessage(index: number) {
    return this.sessionLog.messages.length > index
      ? this.sessionLog.messages[index].content
      : "ERROR 404: Message Not Found";
  }

  getMessages() {
    return this.sessionLog.messages;
  }

  getTitle(): string {
    return this.sessionLog.title;
  }

  getID(): UUID {
    return this.sessionLog.id;
  }

  getStartDate(): number {
    return this.sessionLog.startDate;
  }

  getFileName(): string {
    return this.sessionLog.fileName;
  }

  setID(id: UUID) {
    this.sessionLog.id = id;
  }
}
