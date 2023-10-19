import { ChatCompletionMessage } from "openai/resources/chat";
import { ChatRoles } from "./@types";
import { POST } from "../gpt/post";
import userInput from "../chat/userInput";
import Session, { generateSession, saveSession } from "./Session.class";
import Logger from "ts-logger-node";

export async function gptQuery(
  queryText: string,
  options?: {
    messages?: ChatCompletionMessage[];
    role?: ChatRoles;
    print?: boolean;
  }
): Promise<ChatCompletionMessage[]> {
  const messages = options?.messages || [];

  messages.push({
    role: options?.role || "user",
    content: queryText,
  });
  messages.push(await POST(messages));

  return messages;
}

export function safeShutdown(session: Session): boolean {
  try {
    if (!saveSession(session)) throw new Error();
    Logger.print("Session saved: " + session.getFileName(), "GENERAL");
  } catch (err) {
    Logger.print(err as string, "ERROR");
    return false;
  }

  userInput.readline.close();
  return true;
}

// REWRITE INITIALIZATION TO USE SESSION OBJECT
export async function initializeSession(
  importSessionName?: string
): Promise<Session> {
  // Fetch imported session info

  return generateSession();
}
