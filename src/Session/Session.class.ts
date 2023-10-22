import { ChatCompletionMessage } from "openai/resources";
import { ChatRoles, SessionLog } from "./@types";
import { POST } from "../gpt/post";
import { UUID } from "crypto";
import { defaultChatLog } from "./helper";

export default class Session {
  private sessionLog: SessionLog;
  private saveFolder: string = "./sessions/";

  constructor(session?: SessionLog | undefined) {
    this.sessionLog = session === undefined ? defaultChatLog() : session;
  }

  async ask(
    question: string,
    options?: { print?: boolean; role?: ChatRoles }
  ): Promise<ChatCompletionMessage> {
    this.sessionLog.messages.push({
      role: options?.role ?? "user",
      content: question,
    });

    const postRes = await POST(this.sessionLog.messages);

    this.sessionLog.messages.push(postRes);

    return postRes;
  }

  chatLength = () => this.sessionLog.messages.length;

  getMessage = (index: number) =>
    this.sessionLog.messages.length > index
      ? this.sessionLog.messages[index].content
      : "ERROR 404: Message Not Found";

  getMessages = () => this.sessionLog.messages;
  setMessages = (messages: ChatCompletionMessage[]) =>
    (this.sessionLog.messages = messages);

  getStartDate = (): number => this.sessionLog.startDate;

  getLog = (): SessionLog => this.sessionLog;
  setLog = (log: SessionLog) => (this.sessionLog = this.sessionLog);

  getTitle = (): string => this.sessionLog.title;
  setTitle = (title: string) => (this.sessionLog.title = title);

  getID = (): UUID => this.sessionLog.id;
  setID = (id: UUID) => (this.sessionLog.id = id);

  getFileName = (): string => this.sessionLog.fileName;
  setFileName = (fileName: string) => (this.sessionLog.fileName = fileName);

  getSaveFolder = () => this.saveFolder;
  setSaveFolder = (saveFolder: string) => (this.saveFolder = saveFolder);
}
